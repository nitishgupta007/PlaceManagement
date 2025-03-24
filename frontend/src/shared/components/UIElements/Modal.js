import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Modal.css';
import Backdrop from './Backdrop';

const ModalOverlay = (props) => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );

    return createPortal(content, document.getElementById('modal-hook'));
};

const Modal = (props) => {
    const nodeRef = useRef(null); // ✅ Required for React 19

    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal"
                nodeRef={nodeRef} // ✅ Pass nodeRef
            >
                <div ref={nodeRef}> {/* ✅ Wrap ModalOverlay in a div for nodeRef */}
                    <ModalOverlay {...props} />
                </div>
            </CSSTransition>
        </>
    );
};

export default Modal;
