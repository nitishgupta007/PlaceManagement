const fs = require('fs');
const HttpError = require('../models/http-error');
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const Place = require('../models/places');
const User = require('../models/users');

const getPlaceById = async(req, res, next) => {
    const placeId = req.params.pid

    let place;
    try {
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError('Something went wrong, please try again later', 500);
        return next(error)
    }

    if (!place) {
        const error = new HttpError('Could not find a place for the provided it.', 404);
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
}

// arrow function  which means expression getPlaceById { ...}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {

        const error = new HttpError('Fetching places failed, please try again later', 500);
        return next(error)
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find aplace for the provided userId it.', 404));
    }
    res.json({ places: places.map(place => place.toObject({getters: true})) })
}

const createPlace = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invaild inputs passed, please check your data', 422);
    }

    const { title, description, coordinates, address } = req.body;

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    })

    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating place faild, please try again', 500)
        return next(error)
    }

    if(!user) {
        const error = new HttpError('We could not find user for provided id', 404)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess })
        user.places.push(createdPlace);
        await user.save({ session: sess});
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500)
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async(req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invaild inputs passed, please check your data', 422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId)
    } catch(err) {
        const error = new HttpError(' Updating place failed, please try again', 500)
        return next(error);
    }

    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place', 401)
        return next(error);
    }
 
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch(err) {
        const error = new HttpError('Something went wrong, please try again', 500)
        return next(error);
    }

    res.status(200).json({ place: place.toObject({getters: true}) })
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    
    let place;
    
    try {
      // Fetch the place and populate the creator field
      place = await Place.findById(placeId).populate('creator');

    } catch (err) {
      return next(new HttpError('Something went wrong, please try again.', 500));
    }
  
    if (!place) {
      return next(new HttpError('Could not find place with the provided ID.', 404));
    }

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError('Not allowed to delete this place.', 401)
        return next(error);
    }
 
    const imagePath = place.image;
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Delete the place within the transaction
      await Place.deleteOne({ _id: placeId }, { session });
  
      // Remove the place from the creator's places array
      if (place.creator) {
        place.creator.places.pull(place._id);
        await place.creator.save({ session });
      }
  
      // Commit the transaction
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      return next(new HttpError('Something went wrong, could not delete place.', 500));
    } finally {
      session.endSession();
    }
  
    fs.unlink(imagePath, err => {
        console.log(err)
    });
    res.status(200).json({ message: 'Deleted Place successfully!' });
  };

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

// {
//     "title": "manali",
//     "description": "best places in summer",
//     "coordinates": { "lat": 32.2432, "lng": 77.1892},
//     "address": "manali road",
//     "creator": "u2"
// }
