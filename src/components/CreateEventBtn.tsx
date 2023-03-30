type Props = {
  onClick: () => void
}

function CreateEventBtn({ onClick }: Props) {
  return (
    <button className='create' onClick={onClick}>
      <span className='txt'>Create Event</span>
      <span className='txt2'>Created!</span>
      <span className='loader-container'>
        <span className='loader'></span>
      </span>
    </button>
  )
}

export default CreateEventBtn
