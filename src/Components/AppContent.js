import React, { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import RemindItem from "./RemindItem";
import styles from "../styles/modules/app.module.scss";
import Button from "./Button";

//  redux
import { useSelector, useDispatch } from "react-redux";
import { fetchReminds } from "../store/slices/remindSlice";

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

function AppContent() {
  const dispatch = useDispatch();

  const reminds = useSelector((state) => state.reminds.items);
  const { noMoreReminds, filter, timeRange } = useSelector(
    (state) => state.reminds
  );
  const { nextCursor, page } = useSelector((state) => state.reminds.pageInfo);

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
              start: moment(timeRange[0]).format("YYYY-MM-DDTHH:MM:SS"),
              end: moment(timeRange[1]).format("YYYY-MM-DDTHH:MM:SS"),
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
    [dispatch, nextCursor, page.limit, timeRange]
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
              />
            ))}

            {/* we render "load more" button if we have more reminds in database and we can fetch them */}
            {!noMoreReminds && (
              <Button
                variant="more"
                type="button"
                onClick={() => {
                  onLoadMoreButton(filter);
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
