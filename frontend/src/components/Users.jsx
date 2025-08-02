import { useState , useEffect } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users , setUsers] = useState([]);
    const [filter , setFilter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setUsers(response.data.user);
        })
        .catch(err => {
            console.error("Error fetching users:", err);
        });
    }, [filter]);


    return <>
        <div>
            Users
        </div>
        <div>
            <input onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" />
        </div>
        <div>
            {users.map(user => <User user={user}/>)}
        </div>
    </>

}

function User({user}) {
    const navigate = useNavigate();

    return <div>
        <div>
            <div>
                <div>
                    {user.firstName[0]}
                </div>
            </div>
            <div>
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>
        <div>
            <Button onClick = {(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label = {"Send Money"}/>
        </div>
    </div>
}