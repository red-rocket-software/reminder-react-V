import React, { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import RemindItem from "./RemindItem";
import styles from "../styles/modules/app.module.scss";
import Button from "./Button";
import { onCreate_deadline_at_noZone } from "../utils/time";

//  redux
import { useSelector, useDispatch } from "react-redux";
import { fetchReminds } from "../store/slices/remindSlice";

//  inline styles
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
    (type, limit, cursor) => {
      switch (type) {
        case "all":
          dispatch(
            fetchReminds({
              listParam: "remind",
              cursor: cursor,
              limit: limit,
            })
          );
          break;
        case "completed":
          dispatch(
            fetchReminds({
              listParam: "completed",
              cursor: cursor,
              limit: limit,
              start: moment(timeRange[0]).format(onCreate_deadline_at_noZone),
              end: moment(timeRange[1]).format(onCreate_deadline_at_noZone),
            })
          );
          break;
        case "current":
          dispatch(
            fetchReminds({
              listParam: "current",
              cursor: cursor,
              limit: limit,
            })
          );
          break;

        default:
          break;
      }
    },
    [dispatch, timeRange]
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
                // loadMoreReminds needed to  download one reminder instead of the deleted one
                loadMoreReminds={onLoadMoreButton}
              />
            ))}

            {/* we render "load more" button if we have more reminds in database and we can fetch them */}
            {!noMoreReminds && (
              <Button
                variant="more"
                type="button"
                onClick={() => {
                  onLoadMoreButton(filter, page.limit, nextCursor);
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
