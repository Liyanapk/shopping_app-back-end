import express from 'express'
import { sighnUpUser, updateUser } from '../../../controller/v1/userController.js'
import { upload } from '../../../middleware/multer/multer.js'






const router=express.Router()





router.post('/' ,upload.single('image'),sighnUpUser)
router.patch('/:id',upload.single('image'),updateUser)






export default router