const util = {
    logger: function( val ){
        console.log( val )
    },
    formatDate: function( date ){
        let fdate = new Date( date )
        return fdate.getMonth() + 1 + '/' + fdate.getDate() + '/' + fdate.getFullYear()
    }
}

export default util
