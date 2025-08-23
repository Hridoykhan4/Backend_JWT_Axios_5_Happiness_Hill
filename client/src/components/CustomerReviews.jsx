import Marquee from "./Marquee";

const CustomerReviews = () => {
    return (
        <div className="py-5 w-[96%] mx-auto">
            <h2 className="text-center font-semibold dark:text-white ">Customer Reviews</h2>            
            <div>
                <Marquee></Marquee>
            </div>
        </div>
    );
};

export default CustomerReviews;