async function login()
{

    var email = document.getElementById('email_address').value;
    var password = document.getElementById('password').value;
    fetch(`http://localhost:8081/adminlogin?email=${email}&pass=${password}`)
    .then(res => res.json())
    .then(async function (data){
        console.log(data);
       if(data.length > 0)
       {
           window.location.href = "table.html";
       }
       else{
           alert("Login Failed");
       }
    })
}
async function order()
{
    fetch(`http://localhost:8081/order_table`)
    .then(res => res.json())
    .then(async function (data){
        for (let index = 0; index < data.length; index++) {
           
            document.getElementById('o_table').innerHTML+=`
            <tr>
            <td>
            ${data[0].order_id}</td>
            <td>
            ${data[0].name}</td>
            <td>
            ${data[0].price}</td>
            <td>
            ${data[0].date}</td>
            </tr>`;

        }

    })
}