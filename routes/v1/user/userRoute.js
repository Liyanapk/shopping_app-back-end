import express from 'express'
import { logginUser, sighnUpUser, updateUser } from '../../../controller/v1/userController.js'
import { upload } from '../../../middleware/multer/multer.js'
import { userAuth } from '../../../middleware/authCheck.js'






const router=express.Router()





router.post('/' ,upload.single('image'),sighnUpUser)
router.post('/login',logginUser)

router.use(userAuth)

router.patch('/:id',upload.single('image'),updateUser)






export default router