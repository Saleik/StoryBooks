import express from 'express'
import {ensureAuth} from '../middleware/auth'
import Story from '../models/Story'
const router = express.Router()

//@desc Show add page
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res)=>{
    res.render('stories/add')
})

//@desc Process add form
//@route POST /stories
router.post('/', ensureAuth, async (req, res)=>{
   try {
       req.body.user = req.user.id
       await Story.create(req.body)
       res.redirect('/dashboard')
       
   } catch (error) {
       console.error(error)
       res.render('error/500')
   }
})

export default router