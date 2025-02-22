import { useState } from "preact/hooks";

/*
import {
    GithubUserApiEntity,
} from "../../../features/PestoApi/login/github/githubUserSlice"
*/

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"


// import { KeyRound as LuKeyRound, SaveAll as LuSaveAll, BugIcon as LuErrorIcon, CheckIcon as LuSuccessIcon, LogInIcon, GithubIcon } from 'lucide-preact';
import { Github as GithubIcon } from 'lucide-react';
import { JSX } from "preact/jsx-runtime";


interface GithubModalProps {
  isOpened?: boolean
  githubHtmlForm?: string
}
/**
 * 
 */
export const GithubModal = ({githubHtmlForm = `<h3>Default Github Login Form<h3/>`, isOpened: isModalOpened = false}: GithubModalProps) => {
  const [isGithubModalOpened, setIsGithubModalOpened] = useState<boolean>(isModalOpened);

  return (
    <>
            {// ------------------------------------------------------------------
            }
            <Dialog 
                 open={isGithubModalOpened}
                 onOpenChange={() => setIsGithubModalOpened(isGithubModalOpened!)}
                >
                    {
                    // <DialogTrigger>Open</DialogTrigger>
                    }
                    <DialogTrigger asChild>
                      <Button variant="outline">Login with Github</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Github Login</DialogTitle>
                        <DialogDescription>
                          Github login with OAuth2 / OIDC flow, permissions will be granted to the pesto app, etc...
                        </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">

                            <div>
                                Github login with OAuth2 / OIDC flow
                            </div>

                        </div>
                      <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                    </Dialog>

    </>
  )
}

/**
 * Those two will have to be 
 * injected by auth context
 */
interface GithubLoginButtonProps {
  github_oauth_client_id: string
  github_oauth_redirect_uri: string
  github_oauth_scopes?: string
}


/**
 * RENDER githubUser TO PROJECT-CARD
 * @param props
 *  githubUser: GithubUserApiEntity => data to render
 *
 *  callback: FUNCTION  => (optional) parent javascript for buttons
 * @returns PROJECT-CARD + BUTTONS (optional)
 */
export function GithubLoginButton({
  github_oauth_client_id, 
  github_oauth_redirect_uri,
  github_oauth_scopes = `user`// `repo+read:email+read:user+admin:gpg_key`
}: GithubLoginButtonProps): JSX.Element {
  //console.log(props)

  // useEffect(() => {
  //   console.log(` [PestoGithubUserUI] Appel USE EFFECT [dispatch(RequestGithubUserList())]`)
  //   dispatch(RequestGithubUserList())
  // }, [dispatch])
  
  // const [ githubUser, setGithubUser] = useState<GithubUserApiEntity>();
  const github_oauth_flow_start_point = `https://github.com/login/oauth/authorize?scope=${github_oauth_scopes}&client_id=${github_oauth_client_id}&redirect_uri=${github_oauth_redirect_uri}`
  
  return (
    <>
            <Button variant={"outline"} onClick={() => {
                console.log(``)
                window.location.href = `${github_oauth_flow_start_point}`
            }}>
              <GithubIcon />
              Github Login
            </Button>

    </>
  )
}
