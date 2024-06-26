import { FC, lazy, Suspense, useEffect } from "react";
import Notification from "./components/notification/Notification";
import Layout from "./components/layout/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import Loading from "./components/loading/Loading";
import { FormattedMessage, IntlProvider } from "react-intl";
import English from "./lang/en.json";
import Arabic from "./lang/ar.json";
import { RootState } from "./store";

// Lazy load the individual pages
const TasksPage = lazy(() => import("./pages/TasksPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const App: FC = () => {
	const showNotification = useSelector((state: RootState) => state.notifications.show);
	const theme = useSelector((state: RootState) => state.themes.theme);
	const locale = useSelector((state: RootState) => state.locales.locale);

	// Handle dark/light mode.
	useEffect(() => {
		document.documentElement.removeAttribute("class");
		document.documentElement.classList.add(theme);
	}, [theme]);

	// Handle i18n stuff.
	let languagePack;
	if (locale.toLowerCase().includes("ar")) {
		languagePack = Arabic;
	} else {
		languagePack = English;
	}

	const title = (
		<FormattedMessage
			id="app.title"
			description="The title of the entire page"
			defaultMessage="Tasks list"
		/>
	);

	return (
		<IntlProvider locale={locale} messages={languagePack}>
			<Layout title={title}>
				<Suspense fallback={<Loading />}>
					<Routes>
						<Route path="/" element={<Navigate to="tasks" />} />
						<Route path="/tasks" element={<TasksPage />} />
						<Route path='/tasks/:taskId' element={<TaskPage />} />
						<Route path="/settings" element={<SettingsPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Suspense>
				<Notification show={showNotification} />
			</Layout>
		</IntlProvider>
	);
};

export default App;
