import express from 'express'
import {ensureAuth, ensureGuest} from '../middleware/auth'
import Story from '../models/Story'
const router = express.Router()

//@desc login/Landing Page
//@route GET /
router.get('/', ensureGuest, (req, res)=>{
    res.status(200).render('login',{
        layout:'login'
    })
})

//@desc Dashboard
//@route GET / dashboard
router.get('/dashboard', ensureAuth,  async (req, res)=>{
        try {
            const stories = await Story.find({user: req.user.id}).lean()
            res.render('dashboard', {
                name: req.user.firstName,
                stories
            })
        } catch (error) {
            console.error(error)
            res.render('error/500')
        }
})

export default router