

const getSearchRequest = (req, res) => {
    const {search} = req.body
    return (
        res.json(search)
    )
}


export  {
    getSearchRequest
}