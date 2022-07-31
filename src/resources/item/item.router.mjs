import {Router} from 'express'
import controllers from './item.controller.mjs'

const itemRouter= Router();

itemRouter.route("/")
.get(controllers.getMany)
.post(controllers.createOne)

itemRouter.route("/:id")
.get(controllers.getOne)
.put(controllers.updateOne)
.delete(controllers.removeOne)

export default itemRouter