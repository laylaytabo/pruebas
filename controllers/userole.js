import model from '../models';

const { UseRole } = model;

class Roles_user {
    static roleall_list(req, res){
        return UseRole
        .findAll()
        .then((rol) => res.status(200).send(rol))
        .catch((error) => { res.status(400).send(error); });
    }

}

export default Roles_user;
