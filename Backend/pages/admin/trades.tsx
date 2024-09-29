import { GetServerSideProps } from "next";
import AdminPanel from "../../../components/AdminPanel";
import { getAdminData } from "../../../lib/api/admin";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check admin authentication here
  const adminData = await getAdminData();
  return { props: { adminData } };
};

const AdminTrades = ({ adminData }) => {
  return <AdminPanel adminData={adminData} />;
};

export default AdminTrades;
