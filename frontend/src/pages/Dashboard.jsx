import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Footer } from "../components/Footer";
import { Users } from "../components/Users";

export const Dashboard = () => {
    return <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <Appbar/>
        <div className="m-8">
            <Balance/>
            <Users />
        </div>
        <Footer/>
    </div>
}