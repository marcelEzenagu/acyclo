import React from 'react'

function FileView({details, loanId,formatDate}) {
    return (
        <div>
            <table style={{width:'100%',marginTop:"2rem", borderCollapse:"collapse"}}>
                <thead>
                    
                    <tr style={{textAlign:'center'}} >
                        <th>Loan ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Principal(net Loan)/ Opening Balance</th>
                        <th>Interest Expense</th>
                        <th>Cashflow</th>
                        <th>Closing Balance(Amortised Cost)</th>
                    </tr>
                
                </thead>
                <tbody>
                    
                { details.map((item, i) => 

                <tr style={{borderBottom: '1px solid black', textAlign:'center'}}  key={i} >
                        <td style={{paddingLeft:'10px'}}>{loanId}</td>
                        <td style={{paddingLeft:'10px'}}>{formatDate(item.startDate)}</td>
                        <td style={{paddingLeft:'10px'}}>{formatDate(item.when)}</td>
                        <td style={{paddingLeft:'10px'}}>{(item.principal).toFixed(2)}</td>
                        <td style={{paddingLeft:'10px'}}>{(item.interestExp).toFixed(2)}</td>
                        <td style={{paddingLeft:'10px'}}>{item.amount}</td>
                        <td style={{paddingLeft:'10px'}}>{(item.closingBal).toFixed(2)}</td>
                </tr> 
                )}
                
                </tbody>
            </table>
                   
        </div>
    )
}

export default FileView
