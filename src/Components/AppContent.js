import React, { useState, useContext, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
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

function AppContent({
  reminds,
  noMoreReminds,
  onUpdateRemind,
  onDeleteRemind,
  onGetAll,
  onGetCompleted,
  onGetCurrent,
  cursor,
}) {
  const [context, setContext] = useContext(Context);

  const dispatch = useDispatch();

  const { nextCursor, page } = useSelector((state) => state.reminds.pageInfo);
  console.log("nextCursor, page: ", nextCursor, page);

  useEffect(() => {
    dispatch(
      fetchReminds({
        listParam: "remind",
        cursor: nextCursor,
        limit: page.limit,
      })
    );
  }, []);

  const onLoadMoreButton = useCallback(
    (type) => {
      switch (type) {
        case "all":
          onGetAll(cursor);
          dispatch(
            fetchReminds({
              listParam: reminds,
              cursor: nextCursor,
              limit: page.limit,
            })
          );
          break;
        case "completed":
          onGetCompleted(cursor, context.timeRange);
          break;
        case "current":
          onGetCurrent(cursor);
          break;

        default:
          break;
      }
    },
    [cursor]
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
                onDeleteRemind={onDeleteRemind}
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
