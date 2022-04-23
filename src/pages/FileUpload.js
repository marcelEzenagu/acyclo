import React,{useEffect, useState} from 'react'
import { getAnalysis } from '../services/apiCalls'
import moment from 'moment'
import FileView from './FileView'

function FileUpload() {
    
  const [values, setValues] = useState({
      sheet:"Sheet1",
      cashFlow:"Cash Flows",
      file:null,
      isLoading:false,
      error:"",
      startDate:"",
      endDate:"",
      body:[],
      interestExpense:0,
      amortisedCost:null,
      showDetails:false,
      dataTable:[],
      loanItems:{},
      usingDate:false,
      totalInterest:  0,
      totalBalance: 0
  })
  

  const handleChange = (name)=> (e) => {
        const value = name === "file" 
        ? e.target.files[0]
        : e.target.value
        setValues({...values, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const fileData = new FormData()
        setValues({...values, isLoading: true})
        values?.sheet && fileData.append('sheet', values?.sheet)
        values?.cashFlow && fileData.append('cashFlow', values?.cashFlow)
        values?.file && fileData.append('file', values?.file)

        getAnalysis(fileData).then(data => {
            // console.log("response from server",data)

            setValues({...values, isLoading:false})
            if(data.success === "true"){
             return   setValues({...values,body: data.message,isLoading:false})
            }else{
                alert(
                    data.message )
                    return setValues({...values, isLoading:false})
            }
        })
        // console.log("value:", values)
    }

    
    const formatDate = (date) => {
        return moment(date).format("YYYY-MM-DD")
    }

    
       
    const filterData = (id) => {
        const result = values.body.find(i => i["Loan ID"] == id)
        let items = {}

        items["principal"] = result["Principal"]
        items["mgtFee"] = result["Management fees %"]
        items["start"] = result["Start Date"]
        items["end"] = result["End Date"]
        items["loanId"] = result["Loan ID"]
        items["interest"] = result["Contractual Interest rate %"]
        items["effectiveRate"] = result["rate"]
    
        setValues({...values,dataTable:result.details,
            loanItems:items, 
            showDetails:true
        })

        return result.details
    }
      
    const handleDetails = () => {
        setValues({...values, usingDate:true})
        const filteredTable = filterData(values.loanItems["loanId"])

        let dateArray = filteredTable?.slice(filteredTable?.findIndex(e => formatDate(e["startDate"]) == values.startDate), (filteredTable?.findIndex(e => formatDate(e["when"]) == values.endDate) + 1))
        let totalInterest = dateArray?.map(item => item.interestExp ).reduce((a,b) => a + b,0 )
        let totalBalance = filteredTable?.find(item => formatDate(item["when"]) == values.endDate )
        return setValues({...values,totalInterest:totalInterest, totalBalance:totalBalance})
    }

    
    return (
        <div style={{display:'flex', justifyContent:'center',width:'100%',alignItems:'center',flex:1, flexDirection:'column'}} >
            {   
                !(values?.body?.length) ?
                <form onSubmit={handleSubmit} style={{display:'flex',marginTop:'20px',border:"1px solid gray",padding:'15px', flexDirection:'column',borderRadius:'5px', justifyContent:'flex-start',alignItems:'center'}}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center'}} >
                        <label style={{paddingRight:'10px'}} htmlFor='file'>Excel File</label>
                        <input 
                            type="file"  
                            onChange={handleChange("file")} 
                            id="file"
                            name="file"
                        />
                    </div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center'}} >
                        <label style={{paddingRight:'10px'}} htmlFor="cashFlow" >CashFlow Sheet Name</label>
                        <input 
                            type="text" 
                            value={values.cashFlow} 
                            placeholder='Please enter the loan ID'  
                            onChange={handleChange("cashFlow")} 
                            required
                        />
                    </div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <label style={{paddingRight:'10px'}} htmlFor='sheet'>Data Sheet Name</label>
                        <input 
                            type="text" 
                            placeholder='Please enter the sheet name' 
                            required
                            value={values.sheet}  
                            onChange={handleChange("sheet")} 
                        />
                    </div>
                    {values.isLoading && 
                        <div style={{backgroundColor:'green',padding:'10px', borderRadius:10, marginTop:'10px'}}>
                            <h4>Kindly wait ...Processing file</h4>
                        </div>
                    }
                    <br />   
                    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',flex:1}} >
                        <button disabled={values.isLoading || !values.cashFlow} style={{color:(values.isLoading || !values.sheet) ? "green" :'white',backgroundColor: (values.isLoading || !values.sheet) ? 'white':'green', border:'none', borderRadius:"5px", padding:'10px'}}  onClick={handleSubmit} type='submit' className="btn btn-success">Continue</button>
                    </div>
                </form>
                
                :
                
                <div style={{display:'flex',width:'100%',flexDirection:'column', justifyContent:'center', alignItems:'center',flex:1}}>
                    {/* top */}
                     
                    <table style={{width:'100%', borderCollapse:"collapse"}} >
                            <thead>
                                <tr style={{textAlign:'center'}} >
                                    <th>Loan ID</th>
                                    <th>Principal(net Loan)/ Opening Balance</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th> Contractual Interest</th>
                                    <th> Tenor</th>
                                    <th> Mgt Fee</th>
                                    <th>Effective Interest rate (%)</th>
                                    {/* <th>Interest Expense</th>
                                    <th>Closing Balance(Amortised Cost)</th> */}
                                    <th></th>
                                </tr>
                            </thead>
                            {values?.body.length && values.body.map((i, k) => 
                                <tbody  key={k} >
                                    <tr style={{borderBottom: '1px solid black', textAlign:'center'}} >
                                        <td style={{paddingLeft:'10px'}}>{i["Loan ID"]}</td>
                                        <td style={{paddingLeft:'10px'}}>{i["Principal"]}</td>
                                        <td style={{paddingLeft:'10px'}}>{formatDate(i["Start Date"])}</td>
                                        <td style={{paddingLeft:'10px'}}>{formatDate(i["End Date"])}</td>
                                        <td style={{paddingLeft:'10px'}}>{i["Contractual Interest rate %"]}</td>
                                        <td style={{paddingLeft:'10px'}}>{i["Tenor  (Years)"]}</td>
                                        <td style={{paddingLeft:'10px'}}>{i["Management fees %"]}</td>
                                        <td style={{paddingLeft:'10px'}}>{(i["rate"] * 100).toFixed(2)}</td>
                                        {/* <td style={{paddingLeft:'10px'}}>{values.interestExpense}</td>
                                        <td style={{paddingLeft:'10px'}}>{values.amortisedCost}</td> */}
                                        <td style={{paddingLeft:'10px'}}>
                                            <button disabled={values.showDetails} onClick={()=>{setValues({...values,showDetails:true}); filterData(i["Loan ID"])}} > ShowDetails</button>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                    </table>
                </div>    
            }
            {values?.showDetails &&
            <>
                <div  style={{border:'1px black solid', padding:10,marginBottom:'20px'}} >
                        <p>Principal:{" "} {values.loanItems.principal} </p>
                        <p>Management Fees(%):{" "} {values.loanItems.mgtFee} </p>
                        <p>Start Date:{" "} {formatDate(values.loanItems.start)} </p>
                        <p>End Date:{" "}{formatDate(values.loanItems.end)} </p>
                        <p>Loan ID:{" "} {values.loanItems.loanId}</p>
                        <p>Contractual Interest Rate:{" "} {values.loanItems.interest} </p>
  
                        <p>Financial Year Start Date:{" "} 
                            <input 
                                type="date"
                                name="startDate"
                                value={values?.startDate}
                                onChange={handleChange('startDate')}
                                min={formatDate(values.loanItems.start)}
                                max={formatDate(values.loanItems.end)}
                            /> 
                        </p>
                        <p>Financial Year End Date:{" "} 
                            <input 
                                type="date"
                                name="endDate"
                                value={values?.endDate}
                                onChange={handleChange('endDate')}
                                
                                min={formatDate(values.loanItems.start)}
                                max={formatDate(values.loanItems.end)}
                            />
                        </p>
                        <button onClick={handleDetails}>Check</button>                     
                        <p>Effective Interest Rate : {" "} {(values.loanItems.effectiveRate * 100).toFixed(2)} </p>
                        <p>Total Interest Expense:{" "}<span>{values.totalInterest.toFixed(2)}</span></p>
                        <p>Amortised Cost:{" "} <span>{typeof(values.totalBalance) === "object" ? (values.totalBalance.closingBal.toFixed(2)): 0}</span></p>
                        
                </div > 
                <div onClick={() => setValues({...values, dataTable:[],loadId:null, showDetails:false})}>
                    <h2 style={{color:"red", cursor:'pointer'}}>Close</h2>
                </div>
                <FileView
                    loanId={values.loadId} 
                    formatDate={formatDate}
                    details={values.dataTable}
                />
            </>
            }
        </div>
    )
}

export default FileUpload
