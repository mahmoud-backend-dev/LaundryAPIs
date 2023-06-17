exports.santizeData = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName:user.lastName,
    phone: user.phone,
  }
} 
