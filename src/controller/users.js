const getAllUsers = (req, res) => {
  const data = {
    id: '1',
    name: "sifa",
    email: "sifa@gmail.com",
    address: "indonesia",
  };
  res.json({
    message: "Get all users succes",
    data: data
  });
};

const createNewUser = (req, res) => {
  console.log(req.body);
  res.json({
    message: "CREATE new user success",
    data: req.body,
  });
};

const updateUser = (req, res) => {
    const { idUser } = req.params;
    console.log('idUser: ', idUser);
    // console.log(req.params);
    res.json({
        message: 'UPDATE user success',
        data: req.body
    })
}


const deleteUser = (req,res) => {
    const { idUser } = req.params;
    res.json({
        message: 'DELETE user success',
        data: {
            id: idUser,
            name: "jono",
            email: "jono@gmail.com",
            address: "KTT",
        }
    
    })
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
