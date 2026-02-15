"use client";

import { useState } from "react";
import styles from "./sidebar.module.css";
import Link from "next/link";

export function Sidebar(
	{
		children,
	}: {
		children?: React.ReactNode;
	},
) {

	const [isOpen, setIsOpen] = useState(true);

	return (
		<div>
			<nav className={styles.nav}>
				<h1 className={styles.title}>W-Auth</h1>
			</nav>
			<div className={`${styles.container} ${isOpen ? styles.open : ""}`}>
				<div className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? "<<" : ">>"}
				</div>
				<div className={styles.sidebar}>
					<h1 className={styles.title}>W-Auth</h1>
					<ul>
						<li><Link href="/">Home</Link></li>
						<li><Link href="/edit-profile">Edit Profile</Link></li>
						<li><Link href="https://judge.w-pcp.dev">AtsuoCoder</Link></li>
						<li className={styles.logoutLink}><Link href="/logout">Logout</Link></li>
					</ul>
				</div>
				<div className={styles.dummySidebar} />
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>
	);

}
