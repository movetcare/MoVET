// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: any) => {
  return (
    <div className="bg-movet-white h-screen">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
