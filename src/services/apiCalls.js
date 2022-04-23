// const baseUrl = "http://localhost:6700/app"
const baseUrl = "https://acyclo.herokuapp.com/"



export const getAnalysis = async(fileData) => {
    try {
        let res = await fetch(baseUrl, {
            method: 'POST', 
            body:fileData
        } )
        return await res.json()
    } catch (e) {
        console.log(e)
    }
}
