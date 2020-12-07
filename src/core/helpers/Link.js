import React from 'react';
import { Link } from "react-router-dom";

export default (props) => {
  const renderLink = (link) => {
    if (!link) {
      return <div />;
    } else if (link.url && link.url.includes('://')) {
      return <a href={link.url} className={link.class}>{link.title}</a>
    } else if (link.url && !link.url.includes('://')) {
      return <Link to={link.url} className={link.class}>{link.title}</Link>
    } else if (link.page) {
      return <Link to={link.page.slug} className={link.class}>{link.title}</Link>
    }
  }
  return renderLink(props.link);
}
