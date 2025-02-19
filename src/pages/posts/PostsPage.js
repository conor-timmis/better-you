import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [tags, setTags] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const currentUser = useCurrentUser();

  /*
    Handles API request by search filters
    displays only posts linked to search results
    Displays list of all posts, hearted posts, 
    followed users posts and posts related to tags 
    When content is loading, loading spinner is
    displayed
  */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(
          `/posts/?${filter}search=${query}${
            tags !== null ? `&tags=${tags}` : ""
          }`
        );
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        return err;
      }
    };
    /*
      API has search timer to prevent
      unnecessary requests on keystroke
    */
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname, currentUser, tags]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>

        {hasLoaded ? (
          <>
            {posts.results.length ? (
              // InfiniteScroll allows for loading of more posts on scroll
              <InfiniteScroll
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              >
                {posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
              </InfiniteScroll>
            ) : (
              // No results displays noresults image and message
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
      <Col className="py-2 p-0 p-lg-2" lg={3}>
        <Container className={`${appStyles.Content} mb-3 mt-3 d-none d-lg-block`}>
          <p className={`${styles.PostTags} font-weight-bold text-center`}>
            <i className={`${styles.TagIcon} fas fa-tag`} ></i> Search by Post Tags
          </p>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Mindfulness")}
          >
            Mindfulness
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Motivation")}
          >
            Motivation
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Personal Growth")}
          >
            Personal Growth
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Time Management")}
          >
            Time Management
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Productivity")}
          >
            Productivity
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Goal Setting")}
          >
            Goal Setting
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Career Development")}
          >
            Career Development
          </Badge>
          <Badge
            variant="primary"
            pill
            className={`${styles.Tags}`}
            onClick={() => setTags("Leadership")}
          >
            Leadership
          </Badge>
        </Container>
      </Col>
    </Row>
  );
}

export default PostsPage;
