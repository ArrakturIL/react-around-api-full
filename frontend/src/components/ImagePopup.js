function ImagePopup({card, onClose, onPopupClick}) {
    return (
        <section onMouseDown={onPopupClick} className={`popup popup_el_preview ${card ? `popup_open` : ``}`}>
            <div className='popup__container popup__container_type_preview'>
                <button
                    type='button'
                    className='popup__close popup__close_el_preview'
                    onClick={onClose}
                ></button>
                <img
                    className='popup__image'
                    src={card ? card.link : ``}
                    alt={card ? card.name : ``}
                />
                <p className='popup__description'>{card ? card.name : ``}</p>
            </div>
        </section>
    );
}

export default ImagePopup;