import RoomsController from "../controllers/rooms"
import express from 'express'

const router = express()

router.post('/', RoomsController.create)
router.get('/:name', RoomsController.findByName)

module.exports = router