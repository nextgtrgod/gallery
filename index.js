const path = require('path')
const express = require('express')

const app = express()

app.set('port', (process.env.PORT || 4000))

app.use(express.static(path.join(__dirname, 'dist')))
app.listen(app.get('port'), () => console.log(`Listening on: http://localhost:${app.get('port')}`))
