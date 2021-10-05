import Baobab from 'baobab'

const tree = new Baobab({
    palette: {
        colors: ['yellow', 'purple'],
        name: 'Glorious colors'
    }
})

const colorsCursor = tree.select('palette', 'colors')

colorsCursor.on('update', function () {
    console.log('Selected colors have updated!')
})

colorsCursor.push('orange')
