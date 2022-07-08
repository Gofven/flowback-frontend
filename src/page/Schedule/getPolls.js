import { postRequest } from "../../utils/API";

export default function getHomePolls() {
  return new Promise((resolve, reject) => {
    let finishedTimePolls = [];

    let data = {
      first_page: false,
      page: 1,
      page_size: 100000000000,
      poll_type: "time",
    };
    postRequest("api/v1/group_poll/home_all_poll_list", data).then(
      (response) => {
        console.log("response", response);
        if (response) {
          const { status, data: res } = response;
          const data = res?.data;
          if (status == "success") {
            data?.forEach((poll) => {
              if (poll.discussion === "Finished" && poll.type === "event") {
                finishedTimePolls.push(poll);
              }
            });
          }
        }
        resolve(finishedTimePolls);
      }
    );
  });
}
