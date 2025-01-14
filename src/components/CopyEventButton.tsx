'use client'

import { Copy, CopyCheck, CopyX } from "lucide-react";
import { Button, ButtonProps } from "./ui/button"
import { useState } from "react";

type CopyEventButtonProps = Omit<ButtonProps, 'children' | 'button'> & { eventId: string; clerkUserId: string };

type CopyState = 'idle' | 'copied' | 'error';

function getCopyIcon(copyState: CopyState) {
    switch (copyState) {
        case 'idle':
            return Copy;
        case 'copied':
            return CopyCheck;
        case 'error':
            return CopyX;
    }
}

function getChildren(copyState: CopyState) {
    switch (copyState) {
        case 'idle':
            return 'Copy Link';
        case 'copied':
            return 'Copied!';
        case 'error':
            return 'Error';
    }
}

export default function CopyEventButton({ eventId, clerkUserId, ...buttonProps }: CopyEventButtonProps) {
    const [copyState, setCopyState] = useState<CopyState>('idle');
    const CopyIcon = getCopyIcon(copyState);

    function onClick() {
        return navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
            .then(() => {
                setCopyState('copied');
                setTimeout(() => setCopyState('idle'), 2000)
            })
            .catch(() => {
                setCopyState('error');
                setTimeout(() => setCopyState('idle'), 2000)
            }); 
    }

    return <Button {...buttonProps} onClick={onClick}>
        <CopyIcon className="size-4 mr-2" />
        {getChildren(copyState)}
    </Button>
}