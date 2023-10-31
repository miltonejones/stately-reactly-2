import { Description } from "@mui/icons-material";
import Flex from "../../../styled/Flex";
import Nowrap from "../../../styled/Nowrap";
import { TinyButton } from "../../../styled/TinyButton";

export default function PageNav({
  onClick,
  pageList,
  pages,
  send,
  page: currentPage,
  ml = 3,
}) {
  return (
    <>
      {pages.map((page) => {
        const childPages = pageList.filter((pg) => pg.pageID === page.ID);
        return (
          <>
            <Flex sx={{ ml }} spacing={0.5}>
              <TinyButton icon={Description} />
              <Nowrap
                variant="body2"
                bold={currentPage?.ID === page.ID}
                hover
                onClick={() => onClick(page)}
              >
                {page.PageName}
              </Nowrap>
            </Flex>
            {!!childPages && (
              <PageNav
                send={send}
                pageList={pageList}
                pages={childPages}
                onClick={onClick}
                page={currentPage}
                ml={ml + 2}
              />
            )}
          </>
        );
      })}
    </>
  );
}
