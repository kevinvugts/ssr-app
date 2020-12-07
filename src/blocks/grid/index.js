/** @flow */
import React from 'react'
import { Button } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import Directory, { ImageTitleCard } from '../../components/directory'
import PreviewDirectory from '../../components/directory/PreviewDirectory'

import { Avatar } from '../../components/elements'
import Link from '../../core/helpers/Link'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

const Header = (props) => {
  if (props.title) {
    return (
      <div className="row mb-4">
        <div className="col-md-8">
          <h3>{props.title}</h3>
        </div>
        {props.link ? (
          <div className="col-md-4 text-right">
            <Link link={props.link} />
          </div>
        ) : null}
      </div>
    )
  }
}

// Stepper specific code, we might move it somewhere else?
const StepperHeader = (props) => {
  console.log(props)
  if (props.title) {
    return (
      <div className="row mb-4 justify-content-center text-center">
        <div className="col-md-8 col-xs-12">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    )
  }
}

const StepperFooter = (props) => {
  const history = useHistory()
  return (
    <div className="row my-4 justify-content-center">
      {props.link ? (
        <>
          <div className="col-md-3 justify-content-end">
            <Button
              variant="link"
              className="btn text-dark w-100"
              type="submit"
              disabled={false}
              onClick={() => history.goBack()}
            >
              Terug
            </Button>
          </div>
          <div className="col-md-3">
            <RouterLink to={props.link.url}>
              <Button
                variant="primary"
                className="btn btn-primary text-light w-100"
                type="submit"
                disabled={false}
              >
                {props.link.title}
              </Button>
            </RouterLink>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default (props) => {
  const renderView = () => {
    switch (props.template) {
      case 'imagesgrid':
        return (
          <PreviewDirectory
            {...props}
            endpoint={props.collectionType}
            renderWrapper={({ results, renderTitle }) => (
              <section className="my-7">
                <div className="container">
                  {props.collectionType === 'specialismes' ? (
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <ScrollAnimation
                          animateIn="animate__animated animate__fadeInUp"
                          animateOnce={true}
                          offset={0}
                          delay={1 * 50}
                        >
                          <Header {...props} />
                        </ScrollAnimation>
                        <div className="row">{results()}</div>
                      </div>
                      <div className="col-12 col-lg-6 mt-2 mt-lg-0">
                        <ScrollAnimation
                          animateIn="animate__animated animate__fadeInUp"
                          animateOnce={true}
                          offset={0}
                          delay={2 * 50}
                        >
                          <div className="card ml-lg-4 shadow bg-white p-5">
                            <div className="row">
                              <div className="col-12 col-lg-6">
                                <img
                                  src="https://s3.eu-west-3.amazonaws.com/enorm.com/c2a_favs_e67860a7d3.png"
                                  className="w-100"
                                />
                              </div>
                              <div className="col-12 col-lg-6 mt-2 p-2">
                                <h3>Plan je project</h3>
                                <p>
                                  Maak een gratis account om je favorieten op te
                                  slaan voor je volgende project.
                                </p>
                                <Link
                                  link={{
                                    url: 'register',
                                    class: 'btn btn-primary',
                                    title: 'Gratis registreren',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </ScrollAnimation>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ScrollAnimation
                        animateIn="animate__animated animate__fadeInUp"
                        animateOnce={true}
                        offset={0}
                        delay={1 * 50}
                      >
                        <Header {...props} />
                      </ScrollAnimation>
                      <div className="row">{results()}</div>
                    </>
                  )}
                </div>
              </section>
            )}
            renderItem={(item, index) => (
              <div
                key={`${index}-${item.id}`}
                className={`d-flex align-items-lg-stretch mb-4 ${
                  props.collectionType === 'specialismes'
                    ? 'col-lg-6'
                    : 'col-lg-3'
                }`}
              >
                <ScrollAnimation
                  animateIn="animate__animated animate__fadeInUpSmall"
                  animateOnce={true}
                  delay={(index % 4) * 50}
                  offset={0}
                  style={{ width: '100%', display: 'flex' }}
                >
                  <ImageTitleCard
                    {...item}
                    format="medium"
                    path={`${
                      props.collectionType === 'specialismes'
                        ? '/members'
                        : '/collections'
                    }`}
                  />
                </ScrollAnimation>
              </div>
            )}
          />
        )

      case 'stepper':
      case 'stepperFinal':
        return (
          <PreviewDirectory
            {...props}
            endpoint={props.collectionType}
            renderWrapper={({ results, renderTitle }) => (
              <section className="my-7">
                <div className="container" style={{ maxWidth: 900 }}>
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUp"
                    animateOnce={true}
                    offset={0}
                    delay={1 * 50}
                  >
                    <StepperHeader {...props} />
                  </ScrollAnimation>
                  <div className="row">{results()}</div>
                  <StepperFooter {...props} />
                </div>
              </section>
            )}
            renderItem={(item, index) => {
              console.log('ITEM', item)
              return (
                <div
                  key={`${index}-${item.id}`}
                  className="d-flex align-items-lg-stretch mb-4 col-lg-3"
                  // onClick={() => {
                  //   console.log('HEY CLICKED item:', item)
                  //   window.localStorage.setItem(
                  //     'selectedBranch',
                  //     JSON.stringify([item])
                  //   )
                  // }}
                  // style={{
                  //   border:
                  //     window.localStorage.getItem('selectedBranch') &&
                  //     JSON.parse(
                  //       window.localStorage.getItem('selectedBranch')
                  //     ).find((o) => o.title === item.title)
                  //       ? '1px solid yellow'
                  //       : 'none',
                  // }}
                >
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUpSmall"
                    animateOnce={true}
                    delay={(index % 4) * 50}
                    offset={0}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <ImageTitleCard
                      minHeight="205px"
                      {...item}
                      format="medium"
                      path={`${
                        props.collectionType === 'specialismes'
                          ? '/members'
                          : '/collections'
                      }`}
                    />

                    {/*
                    <div className="card-body overlay-content text-truncate text-white text-center align-middle d-table h-100">
                      <h2 className="text-shadow align-middle d-table-cell">
                        {item.title}
                      </h2>
                    </div>
                  */}
                  </ScrollAnimation>
                </div>
              )
            }}
          />
        )

      case 'avatars':
        const sizes = ['avatar-sm', 'avatar', 'avatar-lg', 'avatar-xl']
        return (
          <PreviewDirectory
            _limit={36}
            {...props}
            endpoint={props.collectionType}
            renderWrapper={({ results, renderTitle }) => (
              <section className="my-7">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-4 mr-auto align-items-center mb-3">
                      <ScrollAnimation
                        animateIn="animate__animated animate__fadeInUp"
                        animateOnce={true}
                        offset={0}
                        delay={0 * 50}
                      >
                        <h3>{props.title}</h3>
                      </ScrollAnimation>
                      <ScrollAnimation
                        animateIn="animate__animated animate__fadeInUpSmall"
                        animateOnce={true}
                        offset={0}
                        delay={1 * 50}
                      >
                        <ReactMarkdown source={props.description} />
                      </ScrollAnimation>
                      <ScrollAnimation
                        animateIn="animate__animated animate__fadeInUp"
                        animateOnce={true}
                        offset={0}
                        delay={2 * 50}
                      >
                        <Link link={props.link} />
                      </ScrollAnimation>
                    </div>
                    <div className="col-lg-7">
                      <div className="row d-flex justify-content-center">
                        {results()}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            renderItem={(item, index) => (
              <div key={`${index}-${item.id}`} className="d-flex mb-2">
                <ScrollAnimation
                  animateIn="animate__animated animate__zoomIn"
                  animateOnce={true}
                  offset={0}
                  delay={index * 10}
                >
                  <RouterLink to={`/members/profile/${item.slug}`}>
                    <Avatar
                      {...item}
                      format="thumbnail"
                      classNameCaption="d-none"
                      size={sizes[Math.floor(Math.random() * sizes.length)]}
                      classNameSubTitle="nav-item"
                      displayTitle={false}
                    />
                  </RouterLink>
                </ScrollAnimation>
              </div>
            )}
          />
        )

      case 'directory':
      default:
        return <Directory {...props} />
    }
  }

  return renderView()
}
