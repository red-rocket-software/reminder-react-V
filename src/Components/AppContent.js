import React, { useState, useContext, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import RemindItem from "./RemindItem";
import styles from "../styles/modules/app.module.scss";
import Button from "./Button";
import { fetchReminds } from "../store/slices/remindSlice";

import Context from "../utils/context";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function AppContent({ onUpdateRemind }) {
  const [context, setContext] = useContext(Context);

  const dispatch = useDispatch();

  const reminds = useSelector((state) => state.reminds.items);
  const { noMoreReminds } = useSelector((state) => state.reminds);
  const { nextCursor, page } = useSelector((state) => state.reminds.pageInfo);

  // useEffect(() => {
  //   dispatch(
  //     fetchReminds({
  //       listParam: "remind",
  //       cursor: nextCursor,
  //       limit: page.limit,
  //     })
  //   );
  // }, []);

  const onLoadMoreButton = useCallback(
    (type) => {
      switch (type) {
        case "all":
          dispatch(
            fetchReminds({
              listParam: "remind",
              cursor: nextCursor,
              limit: page.limit,
            })
          );
          break;
        case "completed":
          dispatch(
            fetchReminds({
              listParam: "completed",
              cursor: nextCursor,
              limit: page.limit,
              start: moment(context.timeRange[0]).format("YYYY-MM-DDTHH:MM:SS"),
              end: moment(context.timeRange[1]).format("YYYY-MM-DDTHH:MM:SS"),
            })
          );
          break;
        case "current":
          dispatch(
            fetchReminds({
              listParam: "current",
              cursor: nextCursor,
              limit: page.limit,
            })
          );
          break;

        default:
          break;
      }
    },
    [nextCursor]
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={styles.content__wrapper}
    >
      <AnimatePresence>
        {reminds.length ? (
          <div>
            {reminds.map((remind) => (
              <RemindItem
                remind={remind}
                key={remind.id ? remind.id : Math.random()}
                onUpdateRemind={onUpdateRemind}
              />
            ))}

            {/* we render "load more" button if we have more reminds in database and we can fetch them */}
            {!noMoreReminds && (
              <Button
                variant="more"
                type="button"
                onClick={() => {
                  onLoadMoreButton(context.filter);
                }}
              >
                Load more
              </Button>
            )}
          </div>
        ) : (
          <motion.p className={styles.emptyText} variants={child}>
            No Todo Found
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AppContent;
