/** @flow */
import React from 'react'

import axios from 'axios'

import { Button } from 'react-bootstrap'
import { ImageTitleCard } from '../../components/directory'
import PreviewDirectory from '../../components/directory/PreviewDirectory'

import { Link, useHistory } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'
import { ToastMessage } from '../../components/lib'

import { client, generateErrorMessageArray } from '../../utils'
import * as auth from '../../auth-provider'
import { useQuery, useQueryCache } from 'react-query'

import brancheIcon from '../../seed/icons/branche-icon.svg'
import roomIcon from '../../seed/icons/room-icon.svg'
import newsletterIcon from '../../seed/icons/newsletter-icon.svg'

// Stepper specific code, we might move it somewhere else?
const StepperWizard = ({ finishedSteps, ...props }) => {
  return (
    <div className="stepwizard">
      <div className="stepwizard-row setup-panel">
        {/* Step 1 */}
        <div className="stepwizard-step col-sm-4">
          <p>
            <img className="stepper-step-icon" src={brancheIcon} width={30} />
            <Link
              style={{ color: 'black' }}
              disabled={!finishedSteps.includes('step-1')}
              to={'/kies-je-branche'}
            >
              <small>Kies je branches</small>
            </Link>
          </p>
          <span role="label" className="btn btn-primary btn-circle" />
        </div>

        {/* Step 2 */}
        <div className="stepwizard-step col-sm-4">
          <p>
            <img className="stepper-step-icon" src={roomIcon} width={22} />

            {!finishedSteps.includes('step-2') ? (
              <small>Kies je ruimtes</small>
            ) : (
              <Link
                style={{ color: 'black' }}
                to={'/kies-je-ruimtes'}
                disabled={!finishedSteps.includes('step-2')}
              >
                <small>Kies je ruimtes</small>
              </Link>
            )}
          </p>
          <span
            role="label"
            className="btn btn-primary btn-circle"
            disabled={!finishedSteps.includes('step-2')}
          />
        </div>

        {/* Step 3 */}
        <div className="stepwizard-step col-sm-4">
          <p>
            <img
              className="stepper-step-icon"
              src={newsletterIcon}
              width={18}
            />

            {!finishedSteps.includes('step-3') ? (
              <small>Nieuwsbrief</small>
            ) : (
              <Link
                style={{ color: 'black' }}
                disabled={!finishedSteps.includes('step-3')}
                to={'/nieuwsbrief-inschrijving'}
              >
                <small>Nieuwsbrief</small>
              </Link>
            )}
          </p>
          <span
            role="label"
            className="btn btn-primary btn-circle"
            disabled={!finishedSteps.includes('step-3')}
          />
        </div>
      </div>
    </div>
  )
}

const StepperHeader = (props) => {
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

const StepperActions = (props) => {
  const history = useHistory()
  const queryCache = useQueryCache()
  const [error, setError] = React.useState(null)
  const { data: user } = useQuery('me', async () =>
    client('users/me', { token: await auth.getToken() })
  )

  async function subscribeUserToTopics() {
    return client('users/me', {
      data: {
        subscribedTopics: {
          rooms: JSON.parse(localStorage.getItem('selectedSubs')).map(
            (e) => e.id
          ),
          branches: JSON.parse(localStorage.getItem('selectedBranch')).map(
            (e) => e.id
          ),
        },
      },
      method: 'PUT',
      token: await auth.getToken(),
    })
      .then((res) => res.data)
      .catch((error) => Promise.reject(error.response.data))
  }

  async function subscribeToNewsLetter() {
    await subscribeUserToTopics()

    axios
      .post(process.env.REACT_APP_API_URL + '/deals/newsletter', {
        email: user.email,
      })
      .then(() => {
        localStorage.removeItem('finishedSteps')
        localStorage.removeItem('selectedSubs')
        localStorage.removeItem('selectedBranch')
        localStorage.removeItem('subscribingUser')

        queryCache.invalidateQueries('me')

        history.push('/profiel')
      })
      .catch((error) => {
        setError(generateErrorMessageArray(error.response.data))
      })
  }

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
              onClick={async () => {
                queryCache.invalidateQueries('me')
                await subscribeUserToTopics()
                history.push('/profiel')
              }}
            >
              Misschien Later
            </Button>
          </div>
          <div className="col-md-3">
            <Button
              onClick={subscribeToNewsLetter}
              variant="primary"
              className="btn btn-primary text-light w-100"
              type="submit"
              disabled={false}
            >
              {props.link.title}
            </Button>
          </div>
        </>
      ) : null}

      {error && error.length > 0 && (
        <ToastMessage
          resetError={() => setError(null)}
          title="Er is iets misgegaan"
          error={error}
          customStyles={{ bottom: '20px', top: 'unset', right: '20px' }}
        />
      )}
    </div>
  )
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
            <Button
              onClick={() => {
                let array = [...props.finishedSteps, `step-${props.phase + 1}`]

                array = array.filter(
                  (item, index) => array.indexOf(item) === index
                )

                window.localStorage.setItem(
                  'finishedSteps',
                  JSON.stringify(array)
                )

                history.push(props.link.url)
              }}
              variant="primary"
              className="btn btn-primary text-light w-100"
              type="submit"
              disabled={
                (props.selectedItem && props.selectedItem.length === 0) ||
                (props.selectedSubs && props.selectedSubs.length === 0)
              }
            >
              {props.link.title}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default (props) => {
  const [subs] = React.useState(
    (window.localStorage.getItem('selectedBranch') &&
      JSON.parse(window.localStorage.getItem('selectedBranch')).reduce(
        (prev, curr) => [...prev, ...curr.subs],
        []
      )) ||
      []
  )
  const [selectedItem, setSelectedItem] = React.useState(
    () => JSON.parse(window.localStorage.getItem('selectedBranch')) || []
  )
  const [selectedSubs, setSelectedSubs] = React.useState(
    () => JSON.parse(window.localStorage.getItem('selectedSubs')) || []
  )
  const finishedSteps =
    JSON.parse(window.localStorage.getItem('finishedSteps')) || []

  React.useEffect(() => {
    selectedItem &&
      window.localStorage.setItem(
        'selectedBranch',
        JSON.stringify(selectedItem)
      )
  }, [selectedItem])

  React.useEffect(() => {
    selectedSubs &&
      window.localStorage.setItem('selectedSubs', JSON.stringify(selectedSubs))
  }, [selectedSubs])

  const renderView = () => {
    switch (props.template) {
      case 'subs':
        return (
          <PreviewDirectory
            subs={subs}
            {...props}
            renderWrapper={({ results, renderTitle }) => (
              <section className="my-7">
                <div className="container" style={{ maxWidth: 900 }}>
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUp"
                    animateOnce={true}
                    offset={0}
                    delay={1 * 50}
                  >
                    <StepperWizard finishedSteps={finishedSteps} />

                    <StepperHeader {...props} />
                  </ScrollAnimation>
                  <div className="row">{results()}</div>
                  <StepperFooter
                    {...props}
                    selectedSubs={selectedSubs}
                    finishedSteps={finishedSteps}
                  />
                </div>
              </section>
            )}
            renderItem={(item, index) => {
              return (
                <div
                  key={`${index}-${item.id}`}
                  className="d-flex align-items-lg-stretch mb-4 col-lg-3"
                  onClick={() => {
                    // TODO: refactor
                    const prev = selectedSubs
                    let newSelectedSubs = [...prev]

                    if (prev.find((o) => o.id === item.id)) {
                      newSelectedSubs = newSelectedSubs.filter(
                        (e) => e.id !== item.id
                      )
                    } else {
                      newSelectedSubs = [...newSelectedSubs, item]
                    }

                    setSelectedSubs(newSelectedSubs)
                  }}
                >
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUpSmall"
                    animateOnce={true}
                    delay={(index % 4) * 50}
                    offset={0}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <ImageTitleCard
                      selected={
                        selectedSubs.find((o) => o.id === item.id) !== undefined
                      }
                      disabledLink
                      minHeight="205px"
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
              )
            }}
          />
        )
      case 'final':
        return (
          <section className="my-7">
            <div className="container" style={{ maxWidth: 900 }}>
              <ScrollAnimation
                animateIn="animate__animated animate__fadeInUp"
                animateOnce={true}
                offset={0}
                delay={1 * 50}
              >
                <StepperWizard finishedSteps={finishedSteps} />
                <StepperHeader {...props} />
              </ScrollAnimation>

              <StepperActions {...props} />
            </div>
          </section>
        )

      case 'stepper':
      default:
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
                    <StepperWizard finishedSteps={finishedSteps} />
                    <StepperHeader {...props} />
                  </ScrollAnimation>
                  <div className="row">{results()}</div>
                  <StepperFooter
                    {...props}
                    selectedItem={selectedItem}
                    finishedSteps={finishedSteps}
                  />
                </div>
              </section>
            )}
            renderItem={(item, index) => {
              return (
                <div
                  key={`${index}-${item.id}`}
                  className="d-flex align-items-lg-stretch mb-4 col-lg-3"
                  onClick={() => {
                    // TODO: refactor
                    const prev = selectedItem
                    let newSelectedItem = [...prev]

                    if (prev.find((o) => o.id === item.id)) {
                      newSelectedItem = newSelectedItem.filter(
                        (e) => e.id !== item.id
                      )
                    } else {
                      newSelectedItem = [...newSelectedItem, item]
                    }

                    setSelectedItem(newSelectedItem)
                  }}
                >
                  <ScrollAnimation
                    animateIn="animate__animated animate__fadeInUpSmall"
                    animateOnce={true}
                    delay={(index % 4) * 50}
                    offset={0}
                    style={{ width: '100%', display: 'flex' }}
                  >
                    <ImageTitleCard
                      selected={
                        selectedItem.find((o) => o.id === item.id) !== undefined
                      }
                      disabledLink
                      minHeight="205px"
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
              )
            }}
          />
        )
    }
  }

  return renderView()
}
