import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <section className="flex w-full justify-center">
    <UserProfile />
  </section>
);

export default UserProfilePage;
