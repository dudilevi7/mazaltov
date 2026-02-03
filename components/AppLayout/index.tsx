interface AppLayoutProps {
    children: React.ReactNode;
}
const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="flex min-h-screen text-black">
            {children}
        </div>
    )
}
export default AppLayout;