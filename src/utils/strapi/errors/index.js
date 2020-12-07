// We use any for now since I am not able to determine the type.
// We can provide an interface of the expected structure of the array/subarray
// But I am  not sure if this is good practise as the API might change later
function generateErrorMessageArray(errorArray) {
  return errorArray.message.map(subArray =>
    subArray.messages.map(messageObject => messageObject.message)
  )
}

function generateErrorMessageArrayForPost(errorArray) {
  return errorArray.errors.map(err => err.title)
}

export {
  generateErrorMessageArray as default,
  generateErrorMessageArrayForPost,
}
