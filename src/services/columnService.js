import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId)

    if (getNewColumn) {
      // Xử lý cấu trúc data ở đây trc khi trả dữ liệu về (columnModel chỉ chứa cardOrderIds, phía FE-mock-data có thêm cards)
      getNewColumn.cards = []

      // Cập nhạt mảng columnOrderIds trong collection board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    console.log('🚀 ~ file: columnService.js:40 ~ deleteItem ~ targetColumn:', targetColumn)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    // Xoá Column
    await columnModel.deleteOneById(columnId)

    // Xóa toàn bộ Cards thuộc Column trên
    await cardModel.deleteManyByColumnId(columnId)

    // Xoá columnId trong mảng columnOrderIds của cái Board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column và Card xóa thành công' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}
