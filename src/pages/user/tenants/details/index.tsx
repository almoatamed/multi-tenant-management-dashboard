import router from "@/router";
import { dc } from "kt-dc";
const back = () => {
    router.push({
        name: "Tenants",
    });
};

const TenantDetails = dc(() => {



    return () => {
        return <></>;
    };
});

export default TenantDetails;
