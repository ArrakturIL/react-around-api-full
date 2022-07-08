import PopupWithForm from "./PopupWithForm";

function ConfirmDeletePopup({
  isOpen,
  onClose,
  card,
  onCardDelete,
  isLoading,
  handlePopupClick,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onCardDelete(card);
  }
  return (
    <PopupWithForm
      name="confirm"
      title="Are you sure?"
      submitButton="Yes"
      loadingButton="Deleting..."
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      handlePopupClick={handlePopupClick}
    />
  );
}
export default ConfirmDeletePopup;
