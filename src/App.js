import React from "react";
import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PageTitle from "./Components/PageTitle";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login/Login";
import { Registration } from "./pages/Registration/Registration";
import { Header } from "./Components/Header";
import styles from "./styles/modules/app.module.scss";

function App() {
<<<<<<< HEAD
  const [reminds, setReminds] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [noMoreReminds, setNoMoreReminds] = useState(true);
  const [context, setContext] = useState({
    filter: "all",
    timeRange: [new Date(), new Date()],
  });

  const dispatch = useDispatch()

  useEffect(() => {
    setReminds([]);
    setCursor(0);
  }, [context.filter]);
  

  // // fetch all reminds in first render of app
  // useEffect(() => {
  //   getAllReminds()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const getAllReminds = async (cur) => {
  //   try {
  //     await axios
  //       .get(`/remind`, {
  //         params: {
  //           cursor: cur !== 0 ? cursor : 0,
  //           limit: limit,
  //         },
  //       })
  //       .then(({ data }) => {
  //         setReminds((prev) => {
  //           if (
  //             JSON.stringify(prev) === JSON.stringify(data.todos) ||
  //             data.todos.length === 0
  //           ) {
  //             return prev;
  //           } else {
  //             return [...prev, ...data.todos];
  //           }
  //         });
  //         checkForMoreReminds(data.pageInfo.nextCursor);
  //         setCursor(data.pageInfo.nextCursor);
  //       });
  //   } catch (error) {
  //     console.log(error);
=======
  // const onSortReminds = (type) => {
  //   switch (type) {
  //     case "deadline":
  //       setReminds(
  //         reminds
  //           .slice()
  //           .sort((a, b) => moment(a.deadline_at).diff(moment(b.deadline_at)))
  //       );
  //       break;
  //     case "created":
  //       setReminds(
  //         reminds
  //           .slice()
  //           .sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
  //       );
  //       break;
  //     default:
  //       return;
>>>>>>> 7fc9cad (implemented updateRemind method)
  //   }
  // };

  return (
    <div className={styles.bg_container}>
      <Header />
      <div className="container">
        <PageTitle>Reminder GO</PageTitle>
        <div className={styles.app__wrapper}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
          </Routes>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "1.4rem",
          },
        }}
      />
    </div>
  );
}

export default App;
