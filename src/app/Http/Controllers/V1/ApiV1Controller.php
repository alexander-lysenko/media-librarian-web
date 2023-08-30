<?php

namespace App\Http\Controllers\V1;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: 1,
    description: 'Internal API v1 Documentation for the Media Librarian Web App',
    title: 'Media Librarian Web: API',
    contact: new OA\Contact(name: 'admin@example.com', email: 'admin@example.com'),
    license: new OA\License(name: 'Not licensed yet', identifier: 'none', url: ''),
), OA\SecurityScheme(
    securityScheme: 'BearerAuth',
    type: 'http',
    description: 'Paste your Bearer token here. You can obtain a token at the endpoint: `/api/v1/user/login`',
    name: 'api_bearer_token',
    in: 'header',
    scheme: 'bearer',
)]
#[OA\Response(
    response: 'Code204',
    description: 'No Content',
    content: new OA\MediaType(mediaType: 'application/json')
), OA\Response(
    response: 'Code401',
    description: 'Unauthorized',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: '401 Authentication Required'),
    ])
), OA\Response(
    response: 'Code422',
    description: 'Unprocessable Entity',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid'),
    ])
), OA\Response(
    response: 'Code500',
    description: 'Internal Server Error',
    content: new OA\JsonContent(properties: [
        new OA\Property(property: 'message', type: 'string', example: 'An internal server error occurred'),
    ])
)]
/**
 * Base controller for API v1 routing in application
 */
abstract class ApiV1Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public const SECURITY_SCHEME_BEARER = [['BearerAuth' => []]];

    public const PARAM_LIBRARY_ID_REF = '#/components/parameters/libraryId';
    public const PARAM_ITEM_ID_REF = '#/components/parameters/itemId';
    public const PARAM_SORT_ATTR_REF = '#/components/parameters/sortAttribute';
    public const PARAM_SORT_DIR_REF = '#/components/parameters/sortDirection';
    public const PARAM_PAGE_REF = '#/components/parameters/page';
    public const PARAM_PER_PAGE_REF = '#/components/parameters/perPage';

    public const RESPONSE_204_REF = '#/components/responses/Code204';
    // public const RESPONSE_400_REF = '#/components/responses/Code400';
    public const RESPONSE_401_REF = '#/components/responses/Code401';
    // public const RESPONSE_404_REF = '#/components/responses/Code404';
    public const RESPONSE_422_REF = '#/components/responses/Code422';
    public const RESPONSE_500_REF = '#/components/responses/Code500';

    public const SCHEMA_PROFILE_REF = '#/components/schemas/Profile';

    public const SCHEMA_TYPES_REF = '#/components/schemas/DataTypes';
    public const SCHEMA_LIBRARY_REF = '#/components/schemas/LibraryExample';
    public const SCHEMA_LIBRARY_ENTRY_REF = '#/components/schemas/LibraryItemExample';
    public const SCHEMA_LIBRARY_ENTRY_REQUEST_REF = '#/components/schemas/LibraryItemRequestExample';
    public const SCHEMA_LIBRARY_SEARCH_TERM_REF = '#/components/schemas/LibrarySearchTermExample';

    public const SCHEMA_POSTER_BASE64_REF = '#/components/schemas/PosterBase64Example';

    #[OA\Parameter(
        parameter: 'libraryId',
        name: 'id',
        description: 'The ID of an existing Library',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1),
    )]
    private string $libraryId = self::PARAM_LIBRARY_ID_REF;

    #[OA\Parameter(
        parameter: 'itemId',
        name: 'item',
        description: 'The ID of an existing Item in the Library',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer', example: 1),
    )]
    private string $entryId = self::PARAM_ITEM_ID_REF;

    #[OA\Parameter(
        parameter: 'sortAttribute',
        name: 'sort[attribute]',
        description: 'Sort (set sorting attribute)',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', example: 'id'),
    )]
    private string $sortAttribute = self::PARAM_SORT_ATTR_REF;

    #[OA\Parameter(
        parameter: 'sortDirection',
        name: 'sort[direction]',
        description: 'Sort (set sorting direction)',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', enum: ['asc', 'desc'], nullable: true),
    )]
    private string $sortDirection = self::PARAM_SORT_DIR_REF;

    #[OA\Parameter(
        parameter: 'page',
        name: 'page',
        description: 'Pagination (set current page)',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', example: 1),
    )]
    private string $page = self::PARAM_PAGE_REF;

    #[OA\Parameter(
        parameter: 'perPage',
        name: 'perPage',
        description: 'Pagination (set entries per page)',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 50, enum: [0, 25, 50, 100, 250]),
    )]
    private string $perPage = self::PARAM_PER_PAGE_REF;

    #[OA\Schema(
        schema: 'PosterBase64Example',
        description: "Attach a poster (in Base64 string format).\n\n" .
        'To convert an image into base64 (for development purposes), ' .
        'you can use this service: https://www.base64-image.de/',
        type: 'string',
        format: 'base64',
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAsLDAoMCg4NCw4MDg0OERQPDA4QFxwaFBgTGxYWERs' .
        'WExgTEhkWGB0XGxgfJyAlHx00KCMtFyMkPik/NEQuKTwBBw0MDRARDQ8PEREPEBQRIxgQDykZGhwRJQocDxQbFBUcDhQXGQ4VHhUlCx8PCi' .
        'odJBkSIxQQDxIbFA0YGisbHf/AABEIARkAvgMBIgACEQEDEQH/xAC0AAABBAMBAAAAAAAAAAAAAAAAAQQFBgMHCAIQAAIBAwICBQQPBQYFB' .
        'AMAAAECAwAEEQUSITEGEyJBURRhcbIHFRYXMjRTcnOBkZKTsbMjM0JS4kNVgqLC0SQlZKPSJjVioYPB0wEBAQEBAQEBAAAAAAAAAAAAAAEC' .
        'AwQFBhEAAgECAwUEBwcFAQAAAAAAAAECAxESITEEE0FhkTJCUYEiUnGCoaLBFCNDYrHR4XJzg7Lx8P/aAAwDAQACEQMRAD8A2fqE0lrpd7d' .
        'xBS9tbyzIG5FlQsM1poeyR0n+TsPwz/8A0rcOsj/07qjd/kc+PwmrlpTwoDZKeyJ0rkJEUFm58EiY/k9A9kPpYwyttaEeIif/AM6q2iK5hu' .
        '5EyCnVn7CTT+ykmW7vIN7GFLxGiTuAZ34j5wxXinWwuokk8Nvj/wBPr0dj3i2d4rbybjpo0k09c7kv743SkNtMNkG8Oqb/AM6D7I3Skc4bL' .
        '8Jv/OqSLy89shddc/lAk4S9/wDJ6vCrXJczB3i3blYzyYbiCVdBgg8CpUkYrU6rhhyTur6+Cz4dDls+zKtj9PDaSisuMpWXHL8w698jpP8A' .
        'J2P4f9dHvj9J/k7H8P8ArphHA1vavBGSIJZLnCZOMOhjXPjjZUXp58i057uML17Kzhz3KGESAf4iSfHAqKunisu8kva/0NvY5Ld3lk6bnJ2' .
        '0jFtNc+z6POSRYvfH6UfJ2P4f9dHvj9KP5LH8P+umMd2J3TY6OHihebbzEhkfIYjjkA1jtLuedJXuMSLHclWGB+74ApwHKsOu1e8NLXzzz8' .
        'jcNixuko1F95KSi7cYxT8eOKxIe+P0o8LD8L+uj3x+lHhYfhf11FoZn0uK1Yp8Za0lcKu7qEBYgHb4DnSiSBpzZmKIQrAJWUDxIyg9CNwPP' .
        'Izmtuta+V7c+4uP7HKGyuaTxWu1GOX48k7R+X0nzWRsPod0n1vpJqE9reG2ijhgMwaFOO7eqd7Gr+1vcLzuvsRa097HYey1nWQo3vBZPsHo' .
        'dasOkrc31la6sLi6lvTqCpeBXOwQk42bBwC4rU6uG1liur+6cIUHKM5N4VFqL/rd7Ll2My+9Rcld3lJx3ZReNCwXLA/8QRt5nYtU49dr2p6' .
        'sBPcR2umoY7NIXKZm45dtvFjlaZ9Ib6/t7HQnMsyShRJeDJDNxQYkrm66zdslo/NL65HeOyScqdPElOWsfC8MS9vPmy+9VcY+MH7i0dTcZI' .
        '8oJ8+xaqHSgyxajpRt7i6hW+dVuRHIwBHYWmaXN8vt1pVxdXLvpqPcWE4fEnodhxYcRR17OSw6cb9BHZJShGaks1drjhxqLfk5dC+tb3QXc' .
        '1wePdsXP5V46qcD9+33Vql6FHqU9tpGoG6vZutunjvkZyybBvwSKy9GNSubnpDqcNzM8kPbkgRzlUUPyWtKvfDeNrv4f+ZJbLJb60lLdr0/' .
        'bjw2+vsLeIrj5dvurSdTcHlO33VqjG61fVo9W1O0u7iCPTnCafbw8mweJfxyKXrNWm6SNpsWp30MLW/lC4K5D7N+OKU369Vu+nW30H2WWac' .
        '4pxi5TWeSSi/D8/VNF1eO4VHIuDkAkdlayxsWiRjzZQx9JGajdHkuZtAge9LNdlHE7PzJBZakYPi8XzF/IV6U7pPxR4WrNrWztfgNdaA9zu' .
        'rHws5/02rlsHhXUmtAe53Vj4WU/wCm9ctVs5lp0V+rsJP+pnaD/tf7kU4thi+lbuc2ZH1KyH/7U01s51tNPs8oj9fMT2v4csY96+cBRT2JC' .
        'twD54l+x5P96+JU1qv1k1f2SX7WP2Wxq8aK4wqxduUqcypL8ZH0g9arjKsYLTSyxRKpmj7ZAPadGLAE5bAXkoJ41VVtpOqF3ldnlHVBe8ng' .
        '+af65zh+dN6y166iUp0o3tqm/I+Vss3SpbTUtdxlCUVwvjdmT/lAlih4YVmWZQeezd3/AIlRl0vV6S6cisSL/wB6nTSxo6WYQGUWikS8MgB' .
        'g+zG3lhc86xahmSzuivnP/dWf1XFeNZSjlZOafld5/E+qs6E3e8lTqQ97BSk18rYw0LHWS+mL16kNKK+SX6tx3yOF+cNrj7cV7s4ooVtVVA' .
        'srRRPKR35fILeg7hTG0lMFjcTD+zvFf7HjNdp2m6vPCvm/g8UG6VPZJcYzqS+SDJgriLP88ssw/wAVuc/YSaiUP/OZh/0wH/ZjqUlkCpaw5' .
        '+BNJACe/ckm37S1RiRudXkIB7VumPrEcdcYN2k3xpv/AGPpTgozpwXDbov/ABuCcf0di8+x7x6U6p57NfWiqc0UnROlN9pTnEF5mW1z9brV' .
        'a6ATbdf1qdcN1dm5X6nSpzpPOLmDQtbgGyaYjgPqevVUyjTfegk/dyTPjUPvKu0U/wAOs2k+CqZyg/l6NjvoTz1Vu9rjj9rGvHTaM3E10Rx' .
        '8ktIn+/NXvomxtLrXopOw8WZsebttUcvtnqun6reGaMYsYReKyZLgI0owcjYQK81704Qs7tt+SzPU8tqlVTSisFnycYGXXZ1ktejNyeI7DN' .
        '48NlLaRG+h6Q69jZb3MMsVqp548WqJeUT6P0cDckuJIj+KKk9IY2+jdJdMfnbCV0HmwUrKd5O+mH51BnrlHBSaj2o1HF/2PtWfxS8hz0W1S' .
        'aCwsLNInSJhdySzMOw23LgRt4rUPo26z12H/q9NeQelkdx6tT2jGJOgclw6gvAl11Td67iU4VD3UF5Z61oIvGgbfAkMRiBGIz2Ar5PFu3Rq' .
        'SVNvO2a9mWXy5HDJ1tsiklixprxklOVyc6A4Gj3Hnuf9AqOvLsWHTm6uhHLL1ds2EjGT8CnXRCQ2el6zE3B7SV2+tUI/NaZ6TM910xjmulU' .
        'Gex3Tr3cYa7X9CjFZPFk/eZzkvv8AbZax3T6OMWi820xudKgun2h57dZXVeQJTNZbf4tD9Gnqim9rLazaYHshi1EbJAPBVymBkk91OLf4rD' .
        '9GnqivqR0jnfLU/NvV8M9BtrQHud1Y+FnP+m1ctV1LrWPc7qx8LKfH4bVyzWzmSvttdkIClqRHgoDEuBgY4DkKX23vPCLnu5Hn4/Cp/cQ2y' .
        'NBLJp04BAkl2jsGMKYzlY3wp3rnuzQ8OnTXKlNN1IB5WeWNFwNh34WMd3d9hrju4eqj0Rr1o9mc15vhp04Ec2q3TlCyW5Ebb1Uplc4I4gkj' .
        'vok1O4lCiSO2YK4kG5M8f8RPA94qR6nSRkJaXrqNqyzck3dZGpClyMd658a93mnWFtJCPJ9QdWSXeoALiQSGNQcZXA2kZHPFXdwy9FEdWo1' .
        'JY5Weqvllp07pHnV7gydY0NqZCpTfs7W3wznNC6vciXf1dvtKhXj28GwCoLcckhTjzjhUjClgZpBPp05LzukSABOD/ukyZMZUg54d2KZ39q' .
        'ks6pY2s8TEriErnsuBIpLBivIj71Tdw9VfwXfVV35dq+vftr9GYxrF1vdzHAWYgg4OVA5KpDZwDx9JpH1WR4ZYvJrRUl3Fwq47Rx2hx5jAI' .
        'qOaC4UMXhlVV4OxUgDjt4nGBxrHTdQ9Vf8ANP4G+qtWc21nlzfa694k5dTlmgMTww5O0iUZ3hl5MvawDWRtYuWg2COFZSMNcAYf/YHifQTk' .
        'VEV6jCNIglYpGWAdwNxA7yFyM4puoeqtb+Zrf1rt45Xas3fupWXTSJsv2LUEuq6jG3J7Eo34iVsK36L2FtPC8l1d3cNoS1nbSkdWhrXekap' .
        '0c6Iak8tpLfan5TbBCVREUEtuxxervo3TbRdStp5rvFi1ou+WEkuzJnBdMJxrUoRlZtXsYhVqQUlGTinr0fTW3sbJXUNBtL+7a7W4ntJZU6' .
        'q8WDlNH4NSRaF5PDcww6hOI7wbZxsTkF2YHpXhUxDNb3MEdxaSpPBKu6KVDkEVkrDpU272zLvqllHFktFyTy6WyKkOiNssUMS39zsgkM0AK' .
        'LwenMnRtZbi6uBqM8T3kfV3iqi4cYAP3qmtRmls7EXSBSFliEit3xlwr44jjiohtUvUtkZuoWbqbSVztJUtLDNKwC7sgB0ArO5p+r8WdXtV' .
        'du7m304tN9XG75oE6PGLSm0pL+YWrnccxqTzLFedJfdH5NQe1luNSdZLLhblYV5gq2T2vEVibU9bgiLXYtCEEjShEI2iOeOBznrTnYrsaya' .
        'hql9Z3SQjychobV3LIecrujkdv/4jAq7mHg+r0MqvVUseL0rt4rK+Jq0npx4iXPR3r55Zor+WDyxQmrIiDE/iy/Jl6wv0am8ve+g1NoJWQw' .
        'oBCOEWNgXi3hWa31XUbiOXYLRJY+vIDggb45jAEBL9osMGvcWr3M1p1yRR73juJYF+iCFVPHm2TTc0/D4sLaKq73dw6LsZZaZ9lJckkSFja' .
        'e1ujpYiQyrBG4DkYznLcsmndt8Vg+jT1RWGKUz6f1xKt1kbMCvAYOcd57qzW4xbQjwjT1RXZJJJLQ4Nttt6t3b5jbWgPc7qx7xZT/ptXLVd' .
        'S60B7ndW81lP+m9cs1o5loWW2lTq21mdY3hRZg8B5buMZ2njtyTWSKQ3aSu+rtEqZ3IsJwE6wKGChgeIJc4HCnDvJd25jt5bBc9QZElRYso' .
        'eqKncjnJQqNwasEz6jMZLcrpSF49zugK8Jf8Ab0YFAY824i6l9YZYtwcxNbkZJKzZHHxJr0tzcNLMrao8eCFtkMfWO8QXdEBy7iABWaePVT' .
        'ES7aV+yZWaQHtfsgJAMtzB4cudEvtlMbbYunBpjbmGXk6lE61FLOWIHCgPBki62GG41ORkhTrEbZgbxIyjaGGeyjE+ekjLEGFdZiCIYwMRc' .
        'CFDIpHoCgf4qyJFqcSs4i08qG3IWfJXIRNobOeclYb+6urFYP2NmA5SUPCCGLxsjkOQdzYZQQT/ADk0B6lAmUQXmsRtCWR5Y9gHJiuPEEA8' .
        'KgL2CC3nCW86XCMiuXTkpPND4lakDrTsd0lpavJjG8jjje0nJcAfCI4Uzvb5LxUAtbeAoWIaEYyDjgQBg4xwoBhRRRQDm2uHtixiyrsCElU' .
        '7ZEPird3nrzPOZ8Fo4UYDaxjULuGc5YDhnz15ghnuZlhto3llfgiKMk8M0sNvd3AY28E8wTi5jQsBwJ47QccAaA2p7GOsAST6HOeE2bmz+e' .
        'AN6Vtnka5m6N3Etp0k02WMdsXUaEHwduqYfY1dNvzoUYzWUM4lEjSbZzGZU7sJyABHAHvpr7T2v7PdJM3Vp1Q5AsoUoN+F44UnFS4wTVTOq' .
        '6iL5rcS9gCUorIv8LuM52fBCr2SebKy0BMtpkDja0kpQiVHU4wySuJHU9nvIrxeaXb3JM7vMXiSPq4VIAYw7ynEqTli5BphNqV1lNsqqqz2' .
        '8Uz4UnZLDxPEEAianV5qM1pqotsJJFLKsMSHhhuqSTJYAk7i1ARa2d9HGoNjeFlMiJ214AytPkHqBnLnhkV6SzngEYgtLjETMYdrKSocSBl' .
        '4wfBJYd/8tPp9Tvob2e33L1KySpCzKOBSAyhR/PhimaJNSvItQS3DRMjWwuBw47uplYj0b1WgH8CCLS1jWIwBImVYCclAM4XIApzD+4i+Yv' .
        '5CsKSi404Tj+2gEn3k3Vmh/cRfMX8hUKNNax7ndWPhZT/pvXLVdS62B7nNXPhZT/pvXLVUyTgv7GNogNPVI1LOyk5LEoqqwZ05KQfvUC/00' .
        'XUU8WnrmPc8qOxZXJCg7geAUdrAHLNTJj1cg9dZ2M6ht7B2UgOwjGBxyo4oQoPCm8UOpmAm3tLL/iN8waNk3FFkEzIQp5KUC484FAR4utCX' .
        'aDp8x244tIcnke1jGcjP3s0hutFde1YyghGXcjcmO7aQM92fr286npotSLhn03T5pVXMpYoSoVmiCEsdrZ6skEeOKZFL1fK1jsrJoBN1b52' .
        'KgkSLGQrY7kZvDnQEcl7piSShbRjBIykQNg8NjIRvOXXidwwea17S66PgEvYz7iOW/K7sHxbOKlzFqCsTFpFkjlWCbGTcuWwcY9OKamC+Sa' .
        '3SbTLV3ELQoCyYbYI1Zzg8wSOf81AV+8eze5Z7KOSKE4Ijfjt7uByaa1Py30VpcXlu1payK77JFTggwU3KuUDY3J3YxkkVD3Msc9w8scUcC' .
        'MezDH8FeAHDNAYa9xMqTRu6h0V1ZkPeAckfXXigHawOMgEEigNv9F9d6I+Xw74Y7GbDIjPHwZ37HFkqS1HpPdaTeTWGgaA6StPm5knQqjTN' .
        '4CP/AOmL1Xn0PozddE5tTsBIt2sJl2l+CEcwa28BbTQWkzxxyzLEhFwoDFCyjiG85oaKP7RXPum0nWnghtp5opJNZhj4xpNs2JjPJn3falX' .
        '5uJqpa3r9r0fvoGvVe5ic7Ts4uBxO8bsA7as8M0Fzbw3Ns4kgnjWWFxkZVhkcCARQgSRpKED57DrKmDg7l4g8KZnStNMjSlZTKwILlu4uZc' .
        'D/ABE/eNSFFAMPa6yyCRIwXHZZiQcMzrkd+0twr3NYWs87XEm/rWbeCpxg7BF2fSop5UNLcbNYdJGYQRzwyp4bOouldfAgNCG9JoB3Np1tO' .
        'ZC5l/auZWAPJz2crw4cBUXJps0d2ZIYZ5gpdUl3DfsaMNyPDaX7NNNWudQtp7m6tJXWFHCsmSecUe1sclCFvtei+lmtGuHtpp5IUvPJz22I' .
        'XMVvIg58lk7P/wCSgJ62R4tKWN4zEyRMvVEglQMhRkcDwp1D+4i+Yv5CsCMzWEpYklWuolzz2JNLEn2oorPD+4j+Yv5CoUaa2B7nNXPhZT/' .
        'ptXLVdSa4B7m9XPhZT/pvXLdUyW6U2sypG2jXqcQ0hjiIZyETiMAbQQhOB4lqaSW1uYSkOm6gk7KoVwjMe7cSpbx5eZqcXV9AyyywapdrJg' .
        'NHCoYLnATaMBQo4UC5s+0Bqt23Dsu4YcTtyuMHg231TQDC2tYEg33Fle3QlUSQyw5AUB2jYMF3DhtNPYhpiY/5bqDL1iFg6FsENJwHFfhAh' .
        'fPsr089nAsxs9VnYBmeCBlIUnLyLuyGzgseYHFjXsT2w2LHrE0fAbyV3AsG27jnBGVcnHcARQEcy6ZBcTpcm47GAsKk7lftqVDbipA7J9BI' .
        'pVn0Ekbo9Q4b8nrPPhftU9rzrXuSz0uaQvJqil3LNI5ThnaxHI54kAcu+oBhtYrkHBIyOR84oCXjbQmQm4F2ZWLZ2nkC4xgk8SE8e80yvXt' .
        'Xuc2alIQiKoIwchQpJ4nmRmmlFALRXpEd3VI1Z3YhURRkkngAAOJJrZ2gex7dXI6/XzJZw80tkx1z+nmEoDX1jeSQCSAySLa3G1blFJwwBz' .
        'xwQa3H0bvkgtBp9mttBaDLm7eUKHJA4qg3yk8ubVV/ZEtbOxutO0zS4Fiht4DKUjH8cjlQXPMk7KpGp20ljciPbNbu6CRoGyGTP8JoUsWsP' .
        'Nr/AErisIbg3KNMkCSrwXwcp5krfypFDDFbwKEhgRYoUHcigKB9QFaO9jKz6/pMZzysoHl/xtiH8nat5HnQCUUUUAoxmq1ullvvILq1so7t' .
        'llmXegdGQcQyOVG4OxYSDmpqycai7iHTJi7SXOx36xd6uMruULIEJB28AuaAiLq+JhknWC2aQQ3DOroGBMck6cT6LeM478UsN0xW8SKG1We' .
        'BTcBmT95BiAgyJnhJnPnzEtP5bHRJI5t92VWQdvDKAvAocdjAzls+c1kubLT3kmkmuWR3RI7lwVXsCZpVDYX5Q48+0CgPdm12+nvLcNEYpY' .
        't9mqIUZYimQJAWPaqQi/cx/MX8qwhUjsXSOQyoEkKyHHHJZ/4QBgE4FZov3MfzF/IVCjHXce5rWD4WU/6T1y5XUeujPRrWPNYz/pPXLlUyW' .
        'vUrWySEMLKeN8qE6lkZDkqTvMbORlVbaPPTXqdBYM3VasinjEQFOez6MfC/Kn8bpG7i01bYjdwiRjtSMBQ3EcguM02Wa4j06IxajKrQxuVt' .
        'SobtNJgbN3c4ORw4YNAeDFYNBCby0uIerjQSNbgKWkZnxneW5oo7uYNEVtpsReVoLqe0EOJXb4STF8rt4IRwQhuB5tTqZrlo1MmrxnZN1+e' .
        'qAxLtEmQ3PO8lcVkm6y63RnV42ilJ66SWNSWIfarKVBIGHJPHhQEe0WgF5HKakMuWCAAIqZBx8AtwGe/uFEdpoMjoivqbMclsKO4A4UbO/j' .
        'T6C6v54g51e2XeGZkmVAQesIAI48WwD6CK83V1fQwSTDU7Sc5jbYFG9i27kACAEzQFWkTazbdxjBwjkEZFeKkLzU7++jWO5kDopDAAAcQCo' .
        '5VH0BsT2MbVJ+kzzPztLWSWL55KQ+q7VvEnjxrTvsUY9t7/AMfJR661uE0BqT2TBcrdQovBb6UN6RCiRp/mllrWd5JcXd8QS80uUgTmxYqB' .
        'GAveckcK3B7KThNJ01AnF52kE3oT+v8AyVB+xvoPX3ba1eJ+wtOFnnk8/iPo6Av3RXQYdA0pUIBv7lVe/k+0iNfMlWWgnJqj9Otfv9Dis7b' .
        'S3CX12Wd2Ch3SIcOCuCMufUoUu9eJX6qCWXGerRnx6BmmulTzXOjWFxdAi6mt0e5BXaesK8crgBaelQykMMqwKsD4HhQEBFf38qTrHKFnju' .
        'IoITtX+NSTwK8eYqLZ0kUyYXY9vbXZzGDwuZGhfkOL7VWrGmlWkdws6Ncb1YSBNw2FwQ2SNmTy8a8nSbMldrToqCFRErDZiJmdM5Uk4LtQE' .
        'RfAJFapFBBC80ayyll3oytnrljYtgSAspwe5mamzznd1TxwAXFr5VK2MlpkZyF4k99uWqcuItMjeOzuZbhWZE6lF452BkVgSpGQMg03kTQ5' .
        'VluOsm2xgKxA4IZN0KhRtJ/tn+/QEhb/APtEZ7mgLIMYxGQSile4hMBqdRfuY/mL+QpvGIxpx6l3liaN3jkf4RDbn7gOHHhw5YrPD+4j+Yv' .
        '5CoUZ62Aejmr+PkU/6b1y3XU2tAe53VvEWU/6b1yzVMklZ6g1lKZIIYQ5XYd24jmG5M5HMCnKazKrzN1ELeUP1kwJbnv60BO12AH4gCoSig' .
        'LCekF2ZEcRQgpI02OJBcpGgJDE8E6sEDlmkh12SF3McCKroIurV2CqoxjYP4TgcSOJPGq/RQCnBJwMDuFJRRQC0UUVQbV9ihM6rqD+Fsq/a' .
        '9bfrU/sUriXVZD8nCnr1tioUjdY0qx1uw8hv+sEQkWZHiIDh1yOBZWHIkU/iigt4Ire2RYreFRHDGvIKK90UAUAIH37EMmNvWYG7b4bueKK' .
        'SgPQ4mqnLdzHUbZBJMrTNMLiPkiovlJQrx5sYQDVlnkaGB5EQysuCsa8zxA4cDUUlwk8+6XSGSVgT1rfbg4Q8z+dAV+K/umspjNPcKyxW8k' .
        'O08TI/WM2Tnk6oPQRTnUL+/i0qO5hlkWQgpw72a1guz909YBUyjWkg2SaRhOrDDvGdxAXkOXE+YNRJLCYITLpUkqMpYRD+z3buDADnhfq3Y' .
        'oCDe8uBqM6FztRX2M+CMLbR3PZzxBWRqapPcOJAzOEithLwI4yEIREQRxILbh4bRVlZ7RCxfSZiwy24ZO7sBvD+INisT+1hKgaPcnZkcSw4' .
        '7M5PHtZyVzQEhbMW0iJyQc2wOR8ynUXCGP5q/lWEFfa/KRmJOpJSE81BUkL5sU4T4C/NFQoy1vHuc1c+FlP+m9ctV1JrmPc3rB8LKf9J65b' .
        'qmQooooAooooAooooBaKSlqkNwexS2Bqvoh/11tStT+xU2H1b6OH83rbFQ0FFFFAFFFFAFRWvNjQrtcFnmXqoAFLZkPEchw5VK1inmW2i66' .
        'RWdQ6LgY5swUHiQBgmgKTJC088yOY0ZpP+EcjDCTqV2sDnumqw219FFeWbsvURyaaqpExACy4SfYV7mCtToanZkEG3kyBnJUZHFR9o3D7DS' .
        'tqVtmQy2024cWJUeJTnk/y0BCWk6o0UUzDexjtZc4LdWl1dP2ufONVNQyjq7eEyKPKFKPDJzLo/IA88pPMfw6uU+o2Vu8iSwSZj5uqAg5Xf' .
        'wI58KZ3N5BK5kWSaFAerVFQcGUyEkZPfhs/4TQD9Cfa6TPIeU9X9F1svVY83VbcU8HwR6KZqwfTC4YsrwsyFgQdpUkAgknIp6PgioUjtdA9' .
        'zWsHwsZ/0nrlyuoteA9zWsHwsZ/0nrl2qZCiiigCiiigCiiigClpKWhDbnsU4EurfRQ/m9bYrUvsU8J9W+ih/N621Q0FFFFAJRRRQDO/+LJ' .
        'xI/bwcQcf2i1V0na7kmlZpDG9g1xHxIHWGVvA8wgSrjIsLqEnEbI5ChJACpbuADcCfCsbe1+wFvIxGeEZOwLhhjCk8MMo+sCgISO6nis4nZ' .
        '2ZvKrYiRCSkkB4hz/IWHCQdxFNdRV57uU+USdWvWNbSwSMI3QJNIAwU8HR49p7mG01Yg2kyLgPp7qu7sZQgcOJxyFYro2sECdRBZTsSB1BK' .
        'DCFGweXJgNo8Q9AV+yvZVmsWmlk6lZr3rwzEgJEFYA+IUs4HjivE1xI0cISVz1NnBvIcgmdizbD47kbJP8A8BUt5VHMQj6TZ7GPaJ2EAgej' .
        'z14cxbXddGtt6FCoUAZYv1XMx8Nq8aAkEZm0VHZ+sZrQM0n8xMed310+HwRTNiG0tiEEQNuxEQ5JlT2Pqp6OQqFI3X8e5nWD4WM/6bVy7XU' .
        'Ovge5nWPNZT/ptXL1UyFFFFAFFFFAFFFFAFLSUUBtv2J/jeq/Qw+s9barUvsUnE+rfQw+s9baoUSiiigCiiioUjdYUtppCDMvXQmEDnuDg1' .
        'XTvNtbxpG+JLW1AGCcGK1nhdSMDaTvAq6imEmq2ENw9vKZVlViG7J2jAVmOfBQ60IVqa3iWFjaowkAneFP5mjvTKicv41X/NWfV0YaxgKW2' .
        '5BwP+kPrchU97Z2XVLLuYKwiYAjjiRjHGT85hXie7VwkNtOlrcEJMWuBhNjKSFyf4skVQVVYkmsJreRBIk8UUSvxXZkTYPnZAVz84VlhJuL' .
        'TbNlDc286SgnG2Z5xOFI8QcVKm6u42uYp7yESRK4AC4O5UM7OuYzuUIpr01zeK0tu13brcAB13JyUft2dux8jw9NAP4yzaMhZOrY2gLJy2k' .
        'x5IxT9fgimrmQ6exlKtIYCZGX4JJXJK+anS/BFQpG6+B7mNY81lP+m1cvV1Dr4HuY1jzWU3qNXL1Uhcb7S9OR0ENrqETjZmEo5Ddvc5JJLA' .
        'CLlUe1pogl2NJqSkNtf9lwVsMxQg9rIx/mpkNY1fcGN1IxWMQqXw2IxvwvbU8BvakOramRgzn97HP8Fc9YiqiNkLzUKKEJJLbQOsYOb4RCJ' .
        'VWTY2euKyDJG35TZWFLPR+snRprwjai2z9UwO/OXLqFPIAqB4msMOu6vC6MJ94TZhZFVh2SGXOV7iBQdd1c5Bn4EYxtXguNuBlSQAKAzy2n' .
        'R5O0l9duuCcGEjucgZ5cSB9tL5J0aLyn2ymRASYl6lySOOByplc6tqV1E0VxKJEY7ipVefiMLwqLoCeWLo8bVQ9zMk43ZdEYhsPPzUqANyC' .
        'LGG5s1ehZ9He/VZMdv+wfzbfvcar9FAbe9ixAL7V0R1kHVRBXHpetrkEHjXOHRm+1SC5ez025Nmb0qJrhE3yhUDEKgrdfRC8ubzRpzezyXc' .
        '1vdzW6XEvB2RSOYFAWOiiioaClAzSVVem1+9hoaRQTvbXV/MsMcyttZEBDuwPo9egLaFINVe80vUn1aW5jgHVF3cFnQBuzDsG0vyOxgwPiK' .
        'a2XRhDYQPLq+vpcnJeRLp/tUVM6TBq1nLdW2oXUt9bYjfT55dplXmJI5GQDdjhQhH+1t+YOqkhK77NbRzmM7JUKtHJkSnIVmf7lGoadfXM8' .
        'LpFlYRbsxDINxQYZRuarNRQtirX9hfSy3M0FuetdpQnFcNG8Ag2rmQBMHd3Uk1nqNxqMt1JbMkTwPaJnYSFIKK5CyceDNn5tWqkzQDGMTDS' .
        'EWddsy222ZfBwmDT5fgj0VhuPi030b+qazJ8BfQKAjdfA9zGseaym9Rq5erqHXwPcxrB8LKb1Grl6qZCiiigCiiigCiiigCiiigLX0Qgkm1' .
        'MvbOiXkIjktg30qBigLoCVFbi6IPYLDqVrBNiRbxmdZWHWNlVxIV8Hrn7T7k2eo2t0M5gmjl4eCsGIq59KrATdJbiC3WMNdxR3lozuE7Aif' .
        'ES7+BLgL9a0BvYjBxSVAdEZ2ueiGlu7FnEbx/cleL8kqfqGwqsdK9KbVbCBYyVkjuYSGABwDIqlmyDwVSSas9IQGVlbirAqw8x9FAVPV9dj' .
        'tFayM0UFxmBomIJzCThlAAGGJXH11k6MjXWku7nVxMI5gDbJPwYMXZiEQcVQKE51KWOi6VZFpDCLq7eTrmu7r9pKCCSgQvkoIwcLipUknnQ' .
        'gUUlFAFJS0lAYbn4rP9E/qms6fAX0Cm918Un+if1TTgfBFARmvge5jWPNZTeo1cv11B0gx7mNYPhZTeo1cv1SBRRRQgUUUUAUUUUAUUUUAV' .
        'fOmZFxZaBf99xp6I/pRU/1s9UOrrenyroLp0gILWdzLby+Zcs6Afin7tAbL9jucS9EhF3291Kn5S/66ulaz9iudTZarbHueKX7Qy1syoaQU' .
        'lLRQoUUlFAFFFFCBSUUUBguvik/0T+qacjlTW6+KT/RP6pp0KAi+kOPcxrHms5vUauX66f6Qge5jWPNZzeoa5gqmQooooAooooAooooAooo' .
        'oAr3vk2GPc2wncUydu7lnHLNeKKA2n7FL/8ANr+Due0D/ZIq/wCutw1pL2Ln2dJ5F+UspU/zxPW7TzqGkFLg0nPhVfeN/gpBqRDEksGUUBY' .
        'cGjBqvRJIxCtDqcQYhSWAO0ZHa4cQOH+avGLvgep1TCg9kYzyJ8eOc4FAWPBowar7rdb426rWFDbmIVSQvAjDAHzZHnajq7olBs1gCXthlB' .
        '7Oeat4bd3+WgJ/Bowarwa5Zhui1lAeGWjbA4Yydpz3UEzBVZl1btjcMIx28du1gH4GgJm7+J3H0UnqmnIqPYk6S7HrMtbu2JAVcZUnDqeII' .
        'qQoCK6Qge5jWD4WcvqGuYK6e6RY9y+sHws5fVNcw1SBRRRQgUUUUAUUUUAUUUUAUUUUBdPY/mEPS+xzylE0X2xPXQLc65p6Kv1fSfSn8LuK' .
        'uln+FUKjzS5NJRQouaRz+zf5p/KiigKJZ6hqjasYZ3b2r66dEmZF4p1aGIHYiMg37u2W44xUncyXnlTDr5IFfAiihZXj7kzv6olfHiatJJ5' .
        'V5IUgqQMGgKlHJqBdM3NywTi8bFMOAcYJEQIzt7j/ABVlhuLl75iqTMr7hHbtKwTIXd8I4xyOONWLye357OPpP+9Iba1Ocxjjz50A2JLaVc' .
        'EnLBbpeecYeVQMknOAKkqZSxpFp8sUYxGkLog8wQintARPSPHuX1g+FpJ6prmGunekmPctrB8LR65iqkCiiihAooooAooooAooooAooooCT' .
        '0Vymt6e3hdwfqLXUb/CrlKzcxXlvIOaSxuPqYGurn50KjHRS0VCiUUtJQBSUtJQBSUtFAYLn4pP9E/qmnFNrv4lcfQyeoadUA01C1S/0+6s' .
        'XYol1E0JkHErnvANUH3s9L/vS5/DWtj0UBrj3tNJ/vO7/DWj3tNJ/vO7/DWtkUlBY1x72mk/3nd/hrQfY00jv1S6+4lbIrBdfFz6RQhr73t' .
        'dG/veb7Eo97TR/wC9p/sSrieYpe8/4qApvva6N/e832JR72ujd2rTn0KlW8fB+v8A/dPbb4f1f70BQz7G2jgEnU7z8MV697TSCuRqd39xa2' .
        'PQaFsa497XSRy1O7+4tbBYXjHJnj+5/VWakoDBsuvlk+5/VRsuvlk+5/VWeigMGy6+WT7n9VJsu/lo/uf1U4ooBvsuvlk+5/VRsuvlk+5/V' .
        'TikoDBsuvlk+5/VSbLr5ZPuf1U4oPI0AwuEvGV4e2yOhUyIi47QwQMyDjUhVNPwm9H+o1cl+CvoFAf/2Q==',
    )]
    private string $posterRef = self::SCHEMA_POSTER_BASE64_REF;
}
