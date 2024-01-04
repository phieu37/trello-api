/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // Xử lý CORS
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập chung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hi ${env.AUTHOR}, Back-end Server đang chạy thành công tại Host http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // Thực hiện các tác vụ cleanup trước khi dừng server
  // exitHook(async () => {
  //   console.log('4. Đang ngắt kết nối....')
  //   await CLOSE_DB()
  //   console.log('5. Đã ngắt kết nối tới MongoDB Cloud Atlas')
  // })

  process.on('SIGINT', async () => {
    console.log('4. Đang ngắt kết nối....')
    await CLOSE_DB()
    console.log('5. Database - Disconnected')
    process.exit(0)
  })

  // CHOKIDAR_USEPOLLING=true
}

// Chỉ khi kết nối tới Database thành công thì mới START_SERVER Back-end lên
// Immediately-invoked / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console.log('1. Đang kết nối tới MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Thành công kết nối tới MongoDB Cloud Atlas')

    // Khởi động server Back-end sau khi Connect Database thành công
    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()

// Chỉ khi kết nối tới Database thành công thì mới START_SERVER Back-end lên
// console.log('1. Đang kết nối tới MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Thành công kết nối tới MongoDB Cloud Atlas'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.log(error)
//     process.exit(0)
//   })
