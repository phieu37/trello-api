/**
 *Xử lý điều hướng
 */

import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body', req.body)
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)
    // console.log('req.files', req.files)
    // console.log('req.cookies', req.cookies)
    // console.log('req.jwtDecoded', req.jwtDecoded)

    // Điều hướng dữ liệu sang tầng Service
    const createBoard = await boardService.createNew(req.body)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'phieudev test error')
    // Có kêt quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    return next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    // Sau này khóa MERN Stack nâng cao có thêm userId để lấy board thuộc về user đó
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
