import axios from "axios";
import { api_url } from "./../App.vue";
export default {
    async apiCall() {
        let res = await axios.get(api_url);
        console.log(res.data);
        return res.data;
      }
}