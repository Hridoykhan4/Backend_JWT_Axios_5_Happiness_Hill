import CustomerReviews from "../components/CustomerReviews";
import Banner from "./Banner";
import FeaturedRooms from "./FeaturedRooms";

const Home = () => {
    return (
        <section>
              <Banner></Banner>  
              <FeaturedRooms></FeaturedRooms>
              <CustomerReviews></CustomerReviews>
        </section>
    );
};

export default Home;