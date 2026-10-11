import {requireOwner} from '@/lib/auth';import {Nav} from '@/components/nav';
export default async function PrivateLayout({children}:{children:React.ReactNode}){await requireOwner();return <div className="shell"><Nav/><main className="main">{children}</main></div>}
