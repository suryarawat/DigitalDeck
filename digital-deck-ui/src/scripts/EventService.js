import axios from "axios";

export default {
    async apiCall() {
        let res = await axios.get("http://localhost:5000/newquery");
        console.log(res.data);
        return res.data;
      }
}